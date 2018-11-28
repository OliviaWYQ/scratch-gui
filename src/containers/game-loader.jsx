import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {LoadingStates, onLoadedProject} from '../reducers/project-state';
import log from '../lib/log';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

class GameLoader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'load'
        ]);
    }
    load (e){
        // this.props.onLoadingStarted();
        fetch(e)
            .then(resp => resp.arrayBuffer())
            .then(result => this.props.vm.loadProject(result))
            .then(() => {
                // this.props.onLoadingFinished(this.props.loadingState);
            })
            .catch(error => {
                log.warn(error);
                // this.props.onLoadingFinished(this.props.loadingState);
            });
    }
    render (){
        return this.props.children(this.props.className, this.load);
    }
}

GameLoader.propTypes = {
    canSave: PropTypes.bool, // eslint-disable-line
    children: PropTypes.func,
    className: PropTypes.string,
    // loadingState: PropTypes.oneOf(LoadingStates),
    // onLoadingFinished: PropTypes.func,
    // onLoadingStarted: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};
GameLoader.defaultProps = {
    className: ''
};
const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//     onLoadingFinished: loadingState => {
//         dispatch(onLoadedProject(loadingState, ownProps.canSave));
//         dispatch(closeLoadingProject());
//     },
//     onLoadingStarted: () => {
//         dispatch(openLoadingProject());
//     }
// });

export default connect(
    mapStateToProps,
    // mapDispatchToProps
)(GameLoader);
