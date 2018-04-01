import * as React from 'react';
import {compose} from 'redux';
import {connect, Dispatch} from 'react-redux';
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types';

import {State, toggle} from 'modules/menu-drawer'
import {ReduxState, ReduxAction} from 'store';

// Material-UI
import {withStyles} from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Business from 'material-ui-icons/Business';
import DashBoard from 'material-ui-icons/Dashboard';
import Description from 'material-ui-icons/Description';
import Storage from 'material-ui-icons/Storage';
import CompareArrows from 'material-ui-icons/CompareArrows';
import FileDownload from 'material-ui-icons/FileDownload';

const drawerWidth = 240;

const styles = theme => ({
    content: {
        margin: -8,
    },
    direction: theme.direction,
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },

    appInfo: {
        ...theme.mixins.toolbar,
        display: 'flex',
        flexGrow: 1,
        alignItems: 'flex-start' as 'flex-start',
        paddingLeft: '24px',
        flexDirection: 'column' as 'column',
        justifyContent: 'center' as 'center',
    },
    appTitle: {
        textDecoration: 'none',
        color: 'inherit',
    },
});

interface Props {
    values: ReduxState
    actions: ActionDispatcher
    classes: PropTypes.classesContext
    history: PropTypes.historyContext
}

interface LocalState {
    favarites: Array<number>
    opens: Array<number>
}

export class MenuDrawer extends React.Component<Props, LocalState> {
    constructor(props, context) {
        super(props, context)
        this.state = {
            favarites: [],
            opens: [],
        }
    }

    handleDrawerToggle() {
        this.props.actions.onToggle(!this.props.values.drawer.open)
    };

    handlerChangeMenu(uri: string) {
        // Close Drawer.
        this.props.actions.onToggle(false)
        this.props.history.push(uri)
    }

    handleExpandToggle(id: number) {
        const opens = this.state.opens
        const index = opens.indexOf(id)
        if (index > -1) {
            opens.splice(index, 1);
        } else {
            opens.push(id);
        }
        this.setState({ opens: opens });
    };

    render() {
        const classes = this.props.classes
        const drawer = (
            <div>
                <div className={classes.appInfo}>
                    <Typography
                        color='textSecondary'
                        variant='title'
                    >
                        <Link className={classes.appTitle} to='/'>tamate</Link>
                    </Typography>
                    <Typography
                        color='textSecondary'
                    >
                        v0.1.0
                    </Typography>
                </div>
                <Divider />
                <List dense={true} subheader={<ListSubheader component="div">Actions</ListSubheader>}>
                    <ListItem button onClick={this.handlerChangeMenu.bind(this, '/diff')}>
                        <ListItemIcon>
                            <CompareArrows />
                        </ListItemIcon>
                        <ListItemText inset primary="Compare" />
                    </ListItem>
                    <ListItem button onClick={this.handlerChangeMenu.bind(this, '/dump')}>
                        <ListItemIcon>
                            <FileDownload />
                        </ListItemIcon>
                        <ListItemText inset primary="Dump" />
                    </ListItem>
                </List>
                <List 
                    dense={true}
                    subheader={<ListSubheader component="div">Projects</ListSubheader>}
                >
                    {this.props.values.project.projects.map(project => {
                        return (
                            <div key={project.id}>
                                <ListItem button onClick={this.handleExpandToggle.bind(this, 1)}>
                                    <ListItemIcon>
                                        <Business />
                                    </ListItemIcon>
                                    <ListItemText primary="Project1" />
                                    {this.state.opens.indexOf(1) > -1 ? <ExpandLess /> : <ExpandMore />}
                                </ListItem>
                                <Collapse in={this.state.opens.indexOf(1) > -1} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding dense={true}>
                                        <ListItem button className={classes.nested}  onClick={this.handlerChangeMenu.bind(this, '/projects/1')}>
                                            <ListItemIcon>
                                                <DashBoard />
                                            </ListItemIcon>
                                            <ListItemText inset primary="Dashboard" />
                                        </ListItem>
                                        <ListItem button className={classes.nested}  onClick={this.handlerChangeMenu.bind(this, '/projects/1/schemas')}>
                                            <ListItemIcon>
                                                <Description />
                                            </ListItemIcon>
                                            <ListItemText inset primary="TableSchema" />
                                        </ListItem>
                                        <ListItem button className={classes.nested}  onClick={this.handlerChangeMenu.bind(this, '/projects/1/datasources')}>
                                            <ListItemIcon>
                                                <Storage />
                                            </ListItemIcon>
                                            <ListItemText inset primary="TableData" />
                                        </ListItem>
                                    </List>
                                </Collapse>
                           </div>
                        )
                    })}
                </List>
            </div>
        );
        return (
            <div>
                <Hidden mdUp>
                    <Drawer
                        variant='temporary'
                        anchor={classes.direction === 'rtl' ? 'right' : 'left'}
                        open={this.props.values.drawer.open}
                        onClose={this.handleDrawerToggle.bind(this)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation='css'>
                    <Drawer
                        variant='permanent'
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </div>
        )
    }
}

export class ActionDispatcher {
    constructor(private dispatch: (action: ReduxAction) => void) {}

    public onToggle(open: boolean) {
        this.dispatch(toggle(open))
    }
}

export default compose(
    withStyles(styles, { withTheme: true }),
    connect(
        (state: ReduxState) => ({values: state}),
        (dispatch: Dispatch<ReduxAction>) => ({actions: new ActionDispatcher(dispatch)})
    )
)(MenuDrawer)