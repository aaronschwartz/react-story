import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import glamorous from 'glamorous'
//
import Utils from './utils'

let uid = 0

const defaultProps = {
  stories: [],
  defaultComponent: () => <span>No story component found!</span>,
  WrapperComponent: glamorous.div({
    display: 'flex'
  }),
  SidebarComponent: glamorous.div({
    flexBasis: '100px',
    flexGrow: '1'
  }),
  StoryWrapperComponent: glamorous.div({
    flexBasis: 'auto',
    flexGrow: '3'
  })
}

export default class ReactStory extends React.Component {
  static defaultProps = defaultProps
  constructor () {
    super()
    this.state = {
      stories: []
    }
    this.rebuild = this.rebuild.bind(this)
  }
  componentWillMount () {
    this.rebuild()
  }
  componentWillReceiveProps (newProps) {
    const oldProps = this.props

    if (oldProps.stories !== newProps.stories) {
      this.rebuild()
    }
  }
  rebuild (props = this.props) {
    const {
      defaultComponent
    } = this.props

    const stories = props.stories.map(story => {
      const name = story.name || `Story ${uid++}`
      const path = story.path || Utils.makePath(name)
      const component = story.component || defaultComponent
      return {
        name,
        path,
        component
      }
    })
    this.setState({
      stories
    })
  }
  render () {
    const {
      WrapperComponent,
      SidebarComponent,
      StoryWrapperComponent
    } = this.props

    const {
      stories
    } = this.state

    console.log(stories)

    return (
      <Router>
        <WrapperComponent>
          <SidebarComponent>
            <ul>
              {stories.map(story => (
                <li
                  key={story.path}
                >
                  <Link to={story.path}>
                    {story.name}
                  </Link>
                </li>
              ))}
            </ul>
          </SidebarComponent>
          <StoryWrapperComponent>
            <Switch>
              {stories.map(story => (
                <Route
                  key={story.path}
                  exact
                  path={'/' + story.path}
                  render={props => (
                    <story.component
                      story={story}
                      {...props}
                    />
                  )}
                />
              ))}
              <Redirect
                to={stories[0].path}
              />
            </Switch>
          </StoryWrapperComponent>
        </WrapperComponent>
      </Router>
    )
  }
}
