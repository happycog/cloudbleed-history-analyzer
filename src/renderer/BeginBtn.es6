const React = require('react');

class BeginBtn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: true
        };
        this.beginFunc = props.beginFunc;
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.beginFunc();
        this.setState({ isVisible: false });
    }

    render() {
        return this.state.isVisible ? (
            <a
                className="btn btn-large btn-default"
                onClick={this.handleClick}
            >Begin</a>
        ) : null;
    }

}

export default BeginBtn;
