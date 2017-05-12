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
const emptyObj = () => ({})

const defaultProps = {
  stories: [],
  default: () => <span>No story component found!</span>,
  Wrapper: glamorous.div({
    display: 'flex',
    boxSizing: 'border-box'
  }),
  Sidebar: glamorous.div({
    flexBasis: '250px',
    background: 'rgba(0,0,0, 0.05)',
    borderRight: '3px solid rgba(0,0,0, 0.3)'
  }),
  SidebarList: glamorous.ul({
    padding: 0,
    margin: 0
  }),
  SidebarListItem: glamorous.li({
    padding: 0,
    margin: 0
  }),
  SidebarListItemLink: glamorous(
    ({active, ...rest}) =>
      <Link {...rest} />
    )({
      display: 'block',
      padding: '10px',
      fontSize: '18px',
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.8)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }, ({active}) => ({
      fontWeight: active && 'bold'
    })
  ),
  StoryWrapper: glamorous.div({
    flexBasis: 'auto',
    flexGrow: '3',
    padding: '10px 20px'
  }),
  getWrapperProps: emptyObj,
  getSidebarProps: emptyObj,
  getStoryWrapperProps: emptyObj,
  getSidebarListProps: emptyObj,
  getSidebarListItemProps: emptyObj,
  getSidebarListItemLinkProps: emptyObj
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
      // Components
      Wrapper,
      Sidebar,
      StoryWrapper,
      SidebarList,
      SidebarListItem,
      SidebarListItemLink,
      // Prop getters
      getWrapperProps,
      getSidebarProps,
      getSidebarListProps,
      getSidebarListItemProps,
      getSidebarListItemLinkProps,
      getStoryWrapperProps
    } = this.props

    const {
      stories
    } = this.state

    return (
      <Router>
        <Wrapper
          {...getWrapperProps()}
        >
          <Sidebar
            {...getSidebarProps()}
          >
            <SidebarList
              {...getSidebarListProps()}
            >
              {stories.map(story => (
                <SidebarListItem
                  key={story.path}
                  {...getSidebarListItemProps()}
                >
                  <Route
                    path={'/' + story.path}
                    exact
                    children={({ match }) => (
                      <SidebarListItemLink
                        to={story.path}
                        active={!!match}
                        {...getSidebarListItemLinkProps()}
                      >
                        {story.name}
                      </SidebarListItemLink>
                    )}
                  />
                </SidebarListItem>
              ))}
            </SidebarList>
          </Sidebar>
          <StoryWrapper
            {...getStoryWrapperProps()}
          >
            <Switch>
              {stories.map(story => (
                <Route
                  key={story.path}
                  exact
                  path={'/' + story.path}
                  render={routeProps => (
                    <story.component
                      story={story}
                      route={routeProps}
                    />
                  )}
                />
              ))}
              <Redirect
                to={stories[0].path}
              />
            </Switch>
          </StoryWrapper>
        </Wrapper>
      </Router>
    )
  }
}
