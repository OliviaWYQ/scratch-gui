import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VMScratchBlocks from '../lib/blocks';
import log from '../lib/log.js';
import {connect} from 'react-redux';

class GameLoader extends React.Component {
    constructor (props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        bindAll(this, [
            'load'
        ]);
    }
    
    load (){
        // this.props.onLoadingStarted();
        console.log(this.props);
        console.log('this level:', this.props.level);
        var str = String(this.props.level).split('.');
        var levelnum = Number(str[0].slice(-1));
        if(levelnum<8){
            console.log('next level:', str[0].slice(0, -1).concat(String(levelnum+1), '.', str[1]));
        }        

        fetch(this.props.level)
            .then(resp => resp.arrayBuffer())
            .then(result => this.props.vm.loadProject(result))
            .then(() => {
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
    level: PropTypes.string,
    // loadingState: PropTypes.oneOf(LoadingStates),
    // onLoadingFinished: PropTypes.func,
    // onLoadingStarted: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func,
        deleteSprite: PropTypes.func
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
