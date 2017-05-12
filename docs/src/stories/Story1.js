import React from 'react'

export default props => (
  <div>
    This is a react-story!
    <br />
    <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
  </div>
)

export const knobs = [

]
