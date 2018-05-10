import React, { Component } from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
class CalendarTrainings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: []
		};
	}

	componentDidMount() {
		this.loadTraining();
	}

	// -----------------------------------------Load training section --------------------------------------------------
	loadTraining = () => {
		fetch("https://customerrest.herokuapp.com/api/trainings")
			.then(res => res.json())
			.then(responseData => {
				//Because responseData.content returns objects in array, so we need to loop the response data to set
				//each training event to the "events" state object
				for (var i = 0, l = responseData.content.length; i < l; i++) {
					// assign date, duration, activity to "start", "end", "title" properties respectively
					// convert response date to Js Date
					let eventStartObj = new Date(responseData.content[i].date);

					let eventEndObject = responseData.content[i].duration;

					console.log("START DATE  " + eventStartObj);
					//	.format("ddd MMM DD YYYY HH:mm:ss Z ");

					// calculate event end time
					let endTime = moment
						.utc(eventStartObj, "ddd MMM DD YYYY HH:mm:ss ZZ")
						.add(eventEndObject, "minutes")
						.format("ddd MMM DD YYYY HH:mm:ss ZZ");
					// convert endTime to Js Date
					endTime = new Date(endTime);
					console.log("End Time " + endTime);

					let eventActivityObj = responseData.content[i].activity;

					this.setState({
						events: [
							...this.state.events,
							{
								start: eventStartObj,
								end: endTime,
								title: eventActivityObj
							}
						]
					});
				}
			});
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">
						Welcome to Calendar Trainings page
					</h1>
				</header>
				<p className="App-intro">
					In this page you can see trainings daily, weekly, monthly!
				</p>
				<div className="container">
					<BigCalendar
						defaultDate={new Date()}
						events={this.state.events}
						views={allViews}
						step={15}
						timeslots={8}
						defaultView="week"
						showMultiDayTimes
						resizable
						style={{ height: "100vh" }}
					/>
				</div>
			</div>
		);
	}
}

export default CalendarTrainings;
