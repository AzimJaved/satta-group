import React from 'react';

class PointsTable extends React.Component {
    state = {
        data: [
            { key: "Bhanu", currScore: "69", cumScore: "200" },
            { key: "Azim", currScore: "69", cumScore: "200" },
            { key: "Shrey", currScore: "69", cumScore: "200" },
            { key: "Sanksar", currScore: "69", cumScore: "200" },
            { key: "Mathew", currScore: "69", cumScore: "200" }]
    };
    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr className="tableheader">
                            <th className="tablerow">Position</th>
                            <th className="tablerow">Name</th>
                            <th className="tablerow">currScore</th>
                            <th className="tablerow">cumScore</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((r) =>
                                (<tr className="tablerow" key={r.key}>
                                    <td className="tablerow">1</td>
                                    <td className="tablerow">{r.key}</td>
                                    <td className="tablerow">{r.currScore}</td>
                                    <td className="tablerow">{r.cumScore}</td>
                                </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

setInterval(function () {
    console.log("fetching points");

    //TODO: Poll the server for updated scores

}, 5000);

export default PointsTable;