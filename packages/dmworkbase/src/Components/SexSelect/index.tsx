import React from "react";
import { Component } from "react";
import { IconCheckboxTick } from '@douyinfe/semi-icons';
import { I18nContext } from "../../i18n";
import "./index.css"

export enum Sex {
    Female,
    Male
}

export interface SexSelectProps {
    sex: Sex
    onSelect?: (sex: Sex) => void

}

export interface SexSelectState {
    currentSex:Sex
}

export class SexSelect extends Component<SexSelectProps,SexSelectState>{
    static contextType = I18nContext
    declare context: React.ContextType<typeof I18nContext>

    render() {
        const { onSelect,sex } = this.props
        return <div className="wk-sex-select">
            <div className="wk-sex-select-item" onClick={() => {
                if (onSelect) {
                    onSelect(Sex.Male)
                }
            }}>
                <div style={{"visibility":`${sex===Sex.Male?'unset':'hidden'}`}}><IconCheckboxTick className="wk-sex-select-item checked" size="large" /></div>
                <div className="wk-sex-select-item sex">{this.context.t("base.sexSelect.male")}</div>
            </div>
            <div className="wk-sex-select-item" onClick={() => {
                if (onSelect) {
                    onSelect(Sex.Female)
                }
            }}>
                 <div style={{"visibility":`${sex===Sex.Female?'unset':'hidden'}`}}><IconCheckboxTick className="wk-sex-select-item checked" size="large" /></div>
                <div className="wk-sex-select-item sex">{this.context.t("base.sexSelect.female")}</div>
            </div>
        </div>
    }
}
