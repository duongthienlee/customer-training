import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import AddTraining from "./AddTraining"; // Import css

class DisplayCustomerTraining extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainings: [{}]
        };
    }

    componentDidMount() {
        this.loadTraining();
    }

    // -----------------------------------------Load training section --------------------------------------------------
    loadTraining = () => {
        fetch(this.props.idLink)
            .then(res => res.json())
            .then(responseData => {
                // check props idLink and customerLink
                console.log(
                    this.props.idLink,
                    "\n",
                    this.props.customerLink,
                    "\n"
                );

                //Because responseData.content returns objects in array, so we need to loop the response data to set
                //each training  to the "trainings" state object
                for (var i = 0, l = responseData.content.length; i < l; i++) {
                    // if the responsData return with rel is null, it means the trainings have not been added, hence no need to parse date
                    if (responseData.content[i].rel !== null) {
                        // assign date, duration, activity to "date", "duration", "activity" properties respectively
                        // convert response date to Js Date
                        let date = new Date(responseData.content[i].date);
                        console.log("CUYSTOMSMDMS " + date);
                        let duration = responseData.content[i].duration;

                        let activity = responseData.content[i].activity;

                        this.setState({
                            trainings: [
                                ...this.state.trainings,
                                {
                                    date: date,
                                    duration: duration,
                                    activity: activity
                                }
                            ]
                        });
                    }
                }
            });
    };
    // -----------------------------------------Add training section ---------------------------------------------------
    addTraining = newTraining => {
        fetch("https://customerrest.herokuapp.com/api/trainings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTraining)
        })
            .then(toast.success("Add successfully!"), {
                position: toast.POSITION.BOTTOM_LEFT
            })
            .then(respond => this.loadTraining())
            .catch(error => console.error(error));
    };

    // -----------------------------------------Delete training section ------------------------------------------------
    deleteTraining = value => {
        console.log(value, "this is delete");
        confirmAlert({
            message: "Are you sure to do this.",
            buttons: [
                {
                    label: "Yes",
                    onClick: () =>
                        fetch(value, { method: "DELETE" })
                            .then(res => {
                                this.loadTraining();
                                toast.success("Delete Successfully !", {
                                    position: toast.POSITION.TOP_RIGHT
                                });
                            })
                            .catch(err => console.error(err))
                },
                {
                    label: "No"
                }
            ]
        });
    };

    // -----------------------------------------Edit Training section --------------------------------------------------
    EditTraining(training, link) {
        fetch(link, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(training)
        })
            .then(toast.success("Changes saved!"), {
                position: toast.POSITION.BOTTOM_LEFT
            })
            .catch(err => console.error(err));
    }

    renderEditable = cellInfo => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.trainings];
                    data[cellInfo.index][cellInfo.column.id] =
                        e.target.innerHTML;
                    this.setState({ trainings: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.trainings[cellInfo.index][
                        cellInfo.column.id
                    ]
                }}
            />
        );
    };

    // -----------------------------------------Render section ---------------------------------------------------------
    render() {
        return (
            <div
                style={{
                    position: "relative",
                    width: "70%",
                    top: "-20px",
                    left: "15%"
                }}
            >
                <ToastContainer autoClose={3000} />
                <div className="row">
                    <AddTraining
                        addTraining={this.addTraining}
                        customerLink={this.props.customerLink}
                    />
                </div>

                <ReactTable
                    data={this.state.trainings}
                    columns={[
                        {
                            Header: "Trainings",
                            columns: [
                                {
                                    Header: "Date",
                                    accessor: "date",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Duration",
                                    accessor: "duration",
                                    Cell: this.renderEditable
                                },
                                {
                                    Header: "Activity",
                                    accessor: "activity",
                                    Cell: this.renderEditable
                                },
                                {
                                    id: "button",
                                    sortable: false,
                                    filterable: false,
                                    width: 100,
                                    accessor: "links.self.href",
                                    Cell: ({ value, row }) => (
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => {
                                                this.EditTraining(row, value);
                                            }}
                                        >
                                            Save
                                        </button>
                                    )
                                },
                                {
                                    id: "button",
                                    accessor: "links[1].href",
                                    filterable: false,
                                    sortable: false,
                                    width: 100,
                                    Cell: ({ value }) => (
                                        <button
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => {
                                                this.deleteTraining(value);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )
                                }
                            ]
                        }
                    ]}
                    filterable
                    defaultPageSize={2}
                    className="-striped -highlight "
                />
            </div>
        );
    }
}

export default DisplayCustomerTraining;
