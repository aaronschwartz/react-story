import React from 'react'

export default props => (
  <div>
    I guess we can have as many stories as we want!
    <br />
    <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
  </div>
)

export const knobs = [

]
