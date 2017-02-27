const React = require('react');

class ReportRow extends React.Component {

    constructor(props) {
        super(props);
        this.content = props.content;
    }

    render() {
        return (
            <tr>
                <td><a href={"http://" + this.content}>{this.content}</a></td>
            </tr>
        )
    }

}

export default ReportRow;
