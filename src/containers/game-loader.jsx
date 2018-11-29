import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import makeToolboxXML from '../lib/make-toolbox-xml';
import PropTypes from 'prop-types';
import VMScratchBlocks from '../lib/blocks';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import log from '../lib/log.js';
import Prompt from './prompt.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import ExtensionLibrary from './extension-library.jsx';
import extensionData from '../lib/libraries/extensions/index.jsx';
import CustomProcedures from './custom-procedures.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {STAGE_DISPLAY_SIZES} from '../lib/layout-constants';
import DropAreaHOC from '../lib/drop-area-hoc.jsx';
import DragConstants from '../lib/drag-constants';
import {connect} from 'react-redux';
import {updateToolbox} from '../reducers/toolbox';
import {activateColorPicker} from '../reducers/color-picker';
import {closeExtensionLibrary, openSoundRecorder, openConnectionModal} from '../reducers/modals';
import {activateCustomProcedures, deactivateCustomProcedures} from '../reducers/custom-procedures';
import {setConnectionModalExtensionId} from '../reducers/connection-modal';

import {
    activateTab,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};

const DroppableBlocks = DropAreaHOC([
    DragConstants.BACKPACK_CODE
])(BlocksComponent);

class GameLoader extends React.Component {
    constructor (props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        bindAll(this, [
            'load',
            'attachVM',
            'detachVM',
            'handleCategorySelected',
            'handleConnectionModalStart',
            'handleDrop',
            'handleStatusButtonUpdate',
            'handleOpenSoundRecorder',
            'handlePromptStart',
            'handlePromptCallback',
            'handlePromptClose',
            'handleCustomProceduresClose',
            'onScriptGlowOn',
            'onScriptGlowOff',
            'onBlockGlowOn',
            'onBlockGlowOff',
            'handleExtensionAdded',
            'handleBlocksInfoUpdate',
            'onTargetsUpdate',
            'onVisualReport',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'setBlocks',
            'setLocale'
        ]);
    }
    load (){
        // this.props.onLoadingStarted();
        // console.log(this.props.level);
        fetch(this.props.level)
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
    level: PropTypes.string,
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
