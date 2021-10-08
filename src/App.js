import React, { Component } from 'react';
import {json} from 'd3-request';
//-- Components
import LargeChart from './components/large-chart';
import SmallChart from './components/small-chart';
//-- Data
import * as CONSTANTS from './data/constants';
import secrets from './data/secrets.json'; //***
//-- Styles
import '../node_modules/react-vis/main.css';


const {API} = secrets;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: null
    };
    this._highlightX = this._highlightX.bind(this);
    this._processResults = this._processResults.bind(this);
  }
  
  componentWillMount() {
    //'imperial': Farenheit, 'metric'
    json(`${CONSTANTS.QUERY_PREFIX}?id=${CONSTANTS.CITY_ID}&appid=${API}&units=metric`,
      this._processResults);
  }
  
  _highlightX(highlighted) {
    this.setState({highlighted});
  }
  
  _processResults(error, queryResults) {
    if (error) {
      this.setState({error});
    }
    const data = CONSTANTS.KEYS.map(key => ({
      key,
      values: queryResults.list.map((d, i) => ({
        i,
        x: d.dt * 1000,
        y: d[key.key1] ? d[key.key1][key.key2] || 0 : 0 
      }))
    })).reduce((prev, curr) => {
      return {...prev, [curr.key.name]: curr.values}
    }, {
      'city-name': (
        queryResults &&
        queryResults.city &&
        queryResults.city.name
      ) || 'Unknown'
    });
    this.setState({data});
  }

  render() {
    const {data, error, highlighted} = this.state;
    if (error) {
      return <div>
        <div>Error loading weather information</div>
        <div>{JSON.stringify(this.state.error)}</div>
      </div>;
    }
    if (data) {
      return <div className='app'>
        <div className='appHeader'>
          {data['city-name'] ? `Weather predictions for ${data['city-name']}`:""}
        </div>
        <div
          className='card'
          style={{
            background: 'white',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
            borderRadius: 3,
            margin: 12,
            padding: 24,
            position: 'relative' }}>
          <LargeChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data.Temperature}
            title='Temperature' />
        </div>
        <div
          className='card'
          style={{
            background: 'white',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
            borderRadius: 3,
            margin: 12,
            padding: 24,
            position: 'relative'
          }}>
          <LargeChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data['Min Temperature']}
            title='Min Temperature' />
        </div>
        <div
          className='card'
          style={{
            background: 'white',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
            borderRadius: 3,
            margin: 12,
            padding: 24,
            position: 'relative'
          }}>
          <LargeChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data['Max Temperature']}
            title='Max Temperature' />
        </div>
        <div
          className='bottom-row'
          style={{
            margin: '0 -12px 0 24px',
          }}>
          <SmallChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data.Pressure}
            title='Pressure' />
          <SmallChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data.Cloudiness}
            title='Cloudiness' />
          <SmallChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data['Wind speed']}
            title='Wind Speed' />
          <SmallChart
            highlighted={highlighted}
            highlightX={this._highlightX}
            series={data.Rain}
            title='Rain' />
        </div>
      </div>;
    }
    return <div>Loading data...</div>
  }
}

export default App;