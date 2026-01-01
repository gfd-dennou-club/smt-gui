import React from 'react';
import queryString from 'query-string';
import {connect} from 'react-redux';

/* Higher Order Component to get parameters from the URL query string and initialize redux state
 * @param {React.Component} WrappedComponent: component to render
 * @returns {React.Component} component with query parsing behavior
 */
const QueryParserHOC = function (WrappedComponent) {
    class QueryParserComponent extends React.Component {
        constructor (props) {
            super(props);
            queryString.parse(location.search);
        }
        render () {
            const {
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    {...componentProps}
                />
            );
        }
    }
    return connect(
        null,
        null
    )(QueryParserComponent);
};

export {
    QueryParserHOC as default
};
