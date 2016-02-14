'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var ReactD3 = require('react-d3-components');
var BarChart = ReactD3.BarChart;
var LineChart = ReactD3.LineChart;

var d3 = require('d3');

var data = {
        label: 'somethingA',
        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
};

var sort = null;
var storePosition = {
  Anger: 0,
  Contempt: 1,
  Disgust: 2,
  Fear: 3,
  Happiness: 4,
  Neutral: 5,
  Sadness: 6,
  Surprise: 7,
}

var linearData = [
        {
        label: 'somethingA',
        values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
        },
        {
        label: 'somethingB',
        values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
        }
      ];


export default class Display extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      status: null,
      title: null,
      date: null,
      isEndTransmition: null,
      streamData: null,
      userInfo: null,
      emotions: ['anger', 'contempt', 'disgust', 'fear', 'happiness', 'neutral', 'sadness', 'surprise', '+relevant'],
      anger: false,
      contempt: false,
      disgust: false,
      fear: false,
      happiness: true,
      neutral: true,
      sadness: true,
      surprise: true,
      barChartActive: true,
      lineChartActive: false,
      dataLinearGraph: null
    };
    this.dataLinearGraphLocal = [
      {
        label: 'Anger',
        values: []
      },
      {
        label: 'Contempt',
        values: []
      },
      {
        label: 'Disgust',
        values: []
      },
      {
        label: 'Fear',
        values: []
      },
      {
        label: 'Happiness',
        values: []
      },
      {
        label: 'Neutral',
        values: []
      },
      {
        label: 'Sadness',
        values: []
      },
      {
        label: 'Surprise',
        values: []
      }
    ];
  }

  dataForLinearGraphFunc(streamData) {
    // dataLinearGraph
    console.log('dataForLinearGraphFunc', this.dataLinearGraphLocal);
    this.counter = ++this.counter || 1;
    /*
      [
        {
        label: 'somethingA',
        values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
        },
        {
        label: 'somethingB',
        values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
        }
      ];
    */
    this.state.emotions.forEach((emotion)=>{
      // console.log(this.dataLinearGraphLocal[storePosition[emotion]]);
      if (this.dataLinearGraphLocal[storePosition[emotion]]) {
      this.dataLinearGraphLocal[storePosition[emotion]].values.push({x: this.counter, y: streamData[storePosition[emotion]].y});
      }
    })
    console.log('dataLinearGraphLocal', this.dataLinearGraphLocal);

    this.setState({dataLinearGraph: this.dataLinearGraphLocal});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamData) {
      console.log('nextProps.streamData', nextProps.streamData);
      this.statistics = nextProps.streamData;
      this.statisticsRelevant = nextProps.streamData.values.sort((a, b)=> b.y - a.y);
    // if (nextProps.streamData) {
    //   this.dataForLinearGraphFunc(nextProps.streamData.values);
    // }

      var data = {
        label: this.statistics.label,
        values: this.statistics.values.filter((emotion, i) => this.state[emotion.x])
      }
      if (data.values.length > 0) {
        console.log('data after', data);
        this.setState({
          date: nextProps.date,
          status: nextProps.status,
          title: nextProps.title,
          date: nextProps.date,
          isEndTransmition: nextProps.isEndTransmition,
          streamData: data,
          userInfo: nextProps.userInfo,
        });
      }
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  onEndTransmision() {
    this.props.endStreamEvent();
  }

  onEmotionClick(emotion) {
    if (emotion === '+relevant') {
      var newData = {};
      this.statisticsRelevant.forEach((each, i)=> {
        i <= 3 ? (newData[each.x] = true) : newData[each.x] = false;
      })
      this.setState(newData, function() {
        this.updateGraph();
      });
    } else {
      var counter = 0;
      this.state.emotions.forEach((emotion, i)=> {
        if (this.state[emotion]) counter++;
      })

      this.setState({[emotion]: !this.state[emotion]}, function() {
        this.updateGraph();
      });
    }
  }

  updateGraph() {
    var updatedData = this.statistics.values.filter((emotion, i) => {
      return this.state[emotion.x];
    });
    if (updatedData.length === 0) return;
    this.setState({streamData: {
      label: this.statistics.label,
      values: updatedData}
    });
  }

  onChartClick(Chart) {
    if (!!this.state.streamData) {
      if (Chart === 'Bar') {
        this.setState({
          barChartActive: true,
          lineChartActive: false
        })
      } else {
        this.setState({
          barChartActive: false,
          lineChartActive: true
        })
      }
    }
  }

  render() {
    return (
      <div className="displayWrapper">
        <div className="topBarWrapper">
          <span><h1 className="titleTopBar">Emotolize - {this.state.title}</h1></span>
        </div>

        <div className="wrapperEmotionBar">
          {this.state.emotions.map((emotion, i)=>{
            return (
              <span
                key={i}
                className={this.state[emotion] ? "emotionBarActive" :"emotionBar"}
                onClick={this.onEmotionClick.bind(this, emotion)}>
                <h1 className="emotionLabel">{emotion}</h1>
              </span>);
          })}
        </div>

        <div className="wrapperGraphsBars">
          <span
            className={this.state.barChartActive ? "graphItemActivate" : "graphItem"}
            onClick={this.onChartClick.bind(this, 'Bar')}>
            <h1 className="graphLabel">Bar Chart</h1>
          </span>
        </div>

        <div className="wrapperGraphs">

          {!!this.state.streamData && this.state.barChartActive &&
            <BarChart
              data={this.state.streamData}
              width={700}
              height={400}
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              sort={sort}/>
          }

          {!!this.state.streamData && this.state.lineChartActive &&
            <LineChart
              data={this.state.dataLinearGraph}
              width={700}
              height={400}
              margin={{top: 10, bottom: 50, left: 50, right: 10}}
              sort={sort}/>
          }

        </div>
        <div onClick={this.onEndTransmision.bind(this)}>End Tranasmision</div>
      </div>
      );
  }
};
