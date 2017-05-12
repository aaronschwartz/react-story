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

const mediaKey = '@media(min-width: 415px)'

const defaultProps = {
  stories: [],
  default: () => <span>No story component found!</span>,
  Wrapper: glamorous.div({
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    boxSizing: 'border-box',
    [mediaKey]: {
      flexDirection: 'row'
    }
  }),
  Sidebar: glamorous.div({
    background: 'rgba(0,0,0, 0.05)',
    borderRight: '3px solid rgba(0,0,0, 0.3)',
    [mediaKey]: {
      flex: '0 0 250px'
    }
  }),
  MobileSidebarHeader: glamorous.div({
    display: 'block',
    fontWeight: 'bold',
    padding: '10px',
    fontSize: '18px',
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.8)',
    cursor: 'pointer',
    [mediaKey]: {
      display: 'none'
    }
  }),
  SidebarList: glamorous.ul({
    padding: 0,
    margin: 0,
    [mediaKey]: {
      display: 'block'
    }
  }, (props) => ({
    display: props.open ? 'block' : 'none'
  })),
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
    padding: '10px 20px',
    [mediaKey]: {
      flex: 1
    }
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
      stories: [],
      menuOpen: false
    }
    this.rebuild = this.rebuild.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
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

  toggleMenu () {
    this.setState({
      menuOpen: !this.state.menuOpen
    })
  }

  render () {
    const {
      // Components
      Wrapper,
      Sidebar,
      MobileSidebarHeader,
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
            <MobileSidebarHeader>
              <Switch>
                {stories.map(story => (
                  <Route
                    key={story.path}
                    exact
                    path={'/' + story.path}
                    render={routeProps => (
                      <div onClick={this.toggleMenu}>&#9776; {story.name}</div>
                    )}
                  />
                ))}
              </Switch>
            </MobileSidebarHeader>
            <SidebarList
              open={this.state.menuOpen}
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
                    children={({match}) => (
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
