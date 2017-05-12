import React from 'react'
//
import ReactStory from '../../lib'
//
import Story1, { knobs as Story1Knobs } from './stories/Story1'
// import Story1Source from 'raw-loader!./stories/Story1'

import Story2, { knobs as Story2Knobs } from './stories/Story2'
// import Story2Source from 'raw-loader!./stories/Story2'

import Story3, { knobs as Story3Knobs } from './stories/Story3'
// import Story3Source from 'raw-loader!./stories/Story3'

export default class App extends React.Component {
  render () {
    return (
      <div style={{height: '100vh'}}>
        <ReactStory
          stories={[{
            name: 'Story 1',
            component: Story1,
            knobs: Story1Knobs,
            // source: Story1Source
          }, {
            name: 'Story 2',
            component: Story2,
            knobs: Story2Knobs,
            // source: Story2Source
          }, {
            name: 'Story 3',
            component: Story3,
            knobs: Story3Knobs,
            // source: Story3Source
          }]}
        />
      </div>
    )
  }
}
