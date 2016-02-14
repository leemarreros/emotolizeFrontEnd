'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
var PieChart = require('react-d3-components').PieChart;

var data = {
        label: 'somethingA',
        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
};

var sort = null;

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
      emotions: ['Anger', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness', 'Surprise', '+Relevant'],
      Contempt: false,
      Disgust: false,
      Fear: false,
      Happiness: true,
      Neutral: true,
      Sadness: true,
      Surprise: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    // nextProps.streamData
    this.statistics = nextProps.streamData;
    this.statisticsRelevant = nextProps.streamData.values.sort((a, b)=> b.y - a.y);

    var data = {
      label: nextProps.streamData.label,
      values: nextProps.streamData.values.filter((emotion, i) =>this.state[emotion.x])
    }

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

  componentWillMount() {

  }

  onEndTransmision() {
    this.props.endStreamEvent();
  }

  onEmotionClick(emotion) {
    if (emotion === '+Relevant') {
      var newData = {};
      this.statisticsRelevant.forEach((each, i)=> {
        i <= 3 ? (newData[each.x] = true) : newData[each.x] = false;
      })
      this.setState(newData, function() {
        this.updateGraph();
      });
    } else {
      this.setState({[emotion]: !this.state[emotion]}, function() {
        this.updateGraph();
      });
    }
  }

  updateGraph() {
    var updatedData = this.statistics.values.filter((emotion, i) => {
      return this.state[emotion.x];
    });
    this.setState({streamData: {
      label: this.statistics.label,
      values: updatedData}
    });
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

        <div className="wrapperGraphs">
          <div className="graphItem">
            <h1 className="graphLabel">PieChart</h1>
          </div>
          <div className="graphItem">
            <h1 className="graphLabel">Line Chart</h1>
          </div>
        </div>

        <div>
        {!!this.state.streamData &&
          <PieChart
            data={this.state.streamData}
            width={800}
            height={600}
            margin={{top: 30, bottom: 10, left: 100, right: 100}}
            sort={sort}/>
        }
        </div>
        <div onClick={this.onEndTransmision.bind(this)}>End Tranasmision</div>
      </div>
      );
  }
};
