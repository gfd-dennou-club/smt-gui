import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import RubyGenerator from '../lib/ruby-generator';
import VM from 'scratch-vm';
import {rubyCodeShape} from '../reducers/ruby-code';

class RubyUploader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['uploadProject']);
    }

    uploadProject () {
        const idToTarget = {};
        this.props.vm.runtime.targets.forEach(target => {
            idToTarget[target.id] = target;
        });
        const targets = [idToTarget[this.props.stage.id]];
        for (const id in this.props.sprites) {
            const sprite = this.props.sprites[id];
            targets[sprite.order + 1] = idToTarget[id];
        }
        const options = {
            requires: [],

            withSpriteNew: false
        };
        if (this.props.rubyCode.modified) {
            options.targetsCode = {
                [this.props.rubyCode.target.id]: this.props.rubyCode.code
            };
        }
	// master 部分の抽出
        const targets1 = targets.splice(1, 1);
        const masterCode = RubyGenerator.targetsToCode(targets1, options);
	
	// class 部分の抽出(sprite ではなく stage から抽出)
        const targets2 = targets.splice(0, 1);
        const classCode = RubyGenerator.targetsToCode(targets2, options);

	// class 部分とmaster 部分の結合
	let allCode = classCode + masterCode;

	// 各行の先頭にある「# 」(シャープと半角スペース) または 「#」(シャープのみ) を削除
	allCode = allCode.replace(/^# ?/gm, '');
	
	//エンコード
        const base64MasterCode = btoa(
            String.fromCharCode.apply(
                null,
                new TextEncoder().encode(allCode)
            )
        );

        // 確認
        //console.log(`master: ${base64MasterCode}`);

        // 送信
        const CompileServerURI = 'https://ceres.epi.it.matsue-ct.ac.jp/compile/code';
        const res = fetch(CompileServerURI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: base64MasterCode
            })
        }).then(r => r.json().then(j => {
            // console.table(j);
            window.open(`https://ceres.epi.it.matsue-ct.ac.jp/writer?id=${j.id}`, '_blank', 'noopener');
        }))
            .catch(r => {
            // eslint-disable-next-line no-console
                console.error(r);
            });
        return res;
    }

    render () {
        const {children} = this.props;
        return children(
            this.props.className,
            this.downloadProject,
            this.uploadProject
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.rb`;
};

RubyUploader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    // never used
    // onSaveFinished: PropTypes.func,
    // projectFilename: PropTypes.string,
    rubyCode: rubyCodeShape,
    sprites: PropTypes.objectOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired
        })
    ),
    stage: PropTypes.shape({
        id: PropTypes.string
    }),
    vm: PropTypes.instanceOf(VM)
};
RubyUploader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    projectFilename: getProjectFilename(
        state.scratchGui.projectTitle,
        projectTitleInitialState
    ),
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    vm: state.scratchGui.vm,
    rubyCode: state.scratchGui.rubyCode
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(RubyUploader);
