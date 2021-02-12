'use strict';

import { useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import sendToApi from './sendtoAPI';
import Result from './result';
import getError from './errordict';
import './styles.css';

const plugin = () => {

    const [analyData, setanalyData] = useState(false);

    const analyze = async() => {

        setanalyData(false);

        const getRes = async() => {

            let text = select('core/block-editor').getBlocks();
            text = text.flatMap(obj => {
                if (obj.name === 'core/paragraph') {
                    if (obj.attributes.content) {
                        return [obj.attributes.content];
                    }
                }
                return [];
            });

            if (!text.length) {
                return getError('no_content');
            }

            text = text.join(' ');

            const getApiKey = async() => {

                return apiFetch( 
                        { path: '/text-analysis/v0/api-key' }
                    ).then( key => {
                        return key;
                    }).catch(() => {
                        return false;
                    });
            };
        
            const key = await getApiKey();
            if (!key) {
                return getError('no_key');
            }

            return sendToApi(key, text);
        }

        const res = await getRes();

        setanalyData(res);
    }

    return (
        <Fragment>
            <PluginSidebarMoreMenuItem target='easy-content-analysis' icon='chart-line'>
                Easy Content Analysis
            </PluginSidebarMoreMenuItem>
            <PluginSidebar name='easy-content-analysis' icon='chart-line' title='Easy Content Analysis'>
                <Panel>
                <PanelBody title='Sentiment Analysis' icon='smiley' initialOpen={ true }>
                    <PanelRow><p>Targets for an analysis are only sentences typed in <span className={'bold'}>Paragraph Block</span>.</p></PanelRow>
                    <button className={'analyze'} onClick={() => analyze()}>
                        Analyze
                    </button>
                    {analyData && 
                        <Result res={analyData}/>
                    }
                </PanelBody>
                </Panel>
            </PluginSidebar>
        </Fragment>
    );
};

registerPlugin( 'easy-content-analysis', {
    render: plugin,
} );
