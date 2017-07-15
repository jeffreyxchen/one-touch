import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    AlertIOS,
    Platform,
    NativeModules,
    Image
} from 'react-native';

const io = require('socket.io-client');

// function Button(props) {
//     return (
//         <TouchableOpacity
//         onPress={props.onPress}
//         style={[styles.button, props.style]}>
//         <Text style={styles.buttonText}>{props.children}</Text>
//         </TouchableOpacity>
//     );
// }

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waiting: false,
            validated: false,
            initCheck: false,
            checkFinished: false,
            socket: io('http://localhost:3000')
        };
    }
    componentDidMount() {
        const destination = 'Facebook';
        let authFunction;
        if (Platform.OS === 'android') {
            authFunction = async () => {
                this.setState({ waiting: true });
                try {
                    let result = await NativeModules.ExponentFingerprint.authenticateAsync();
                    if (result.success) {
                        alert('Authenticated!');
                    } else {
                        alert('Failed to authenticate');
                    }
                } finally {
                    this.setState({ waiting: false });
                }
            };
        } else if (Platform.OS === 'ios') {
            authFunction = async () => {
                let result = await NativeModules.ExponentFingerprint.authenticateAsync(
                    'Log in to: ' + destination
                );
                if (result.success) {
                    this.setState({
                        validated: true,
                        initCheck: true
                    })
                    this.state.socket.emit('login_request_t2', {mobile_response: true});
                    checkTimer = setTimeout(() => this.setState({initCheck: false, checkFinished: true}), 4000);
                } else {
                    AlertIOS.alert('Could not validate fingerprint');
                    this.state.socket.emit('login_request_t2', {mobile_response: true});
                }
            };
        }
        authFunction();
        this.state.socket.on('connection', () => {
            console.log('Connected!');
        })
        this.state.socket.on('errorMessage', (message) => {
            console.log(message);
        })
        this.state.socket.on('login_request_mobile', (data) => {
            console.log('Login request received');
            const destination = 'Facebook';
            let authFunction;
            if (Platform.OS === 'android') {
                authFunction = async () => {
                    this.setState({ waiting: true });
                    try {
                        let result = await NativeModules.ExponentFingerprint.authenticateAsync();
                        if (result.success) {
                            alert('Authenticated!');
                        } else {
                            alert('Failed to authenticate');
                        }
                    } finally {
                        this.setState({ waiting: false });
                    }
                };
            } else if (Platform.OS === 'ios') {
                authFunction = async () => {
                    let result = await NativeModules.ExponentFingerprint.authenticateAsync(
                        'Log in to: ' + destination
                    );
                    if (result.success) {
                        this.setState({
                            validated: true,
                            initCheck: true
                        })
                        this.state.socket.emit('login_request_t2', {mobile_response: true, websiteObj: data});
                        checkTimer = setTimeout(() => this.setState({initCheck: false, checkFinished: true}), 4000);
                    } else {
                        this.state.socket.emit('login_request_t2', {mobile_response: false});
                        AlertIOS.alert('Could not validate fingerprint');
                    }
                };
            }
            authFunction();
        })
    }
    renderIf1(condition, content1, content2) {
        if (condition) {
            return content1;
        } else {
            return content2;
        }
    }
    renderIf2(condition1, condition2, content1, content2) {
        if (condition1) {
            return content1;
        } else if (condition2) {
            return content2;
        } else {
            return null;
        }
    }
    showMenu() {
        alert('This is the menu');
        // return(
        //     <View>
        //         <Text>This is the menu</Text>
        //     </View>
        // )
    }
    render() {
        console.log('rendering');
        return (
            this.renderIf1(this.state.validated,
                <View style={[
                    {flex: 1},
                    styles.center,
                    {backgroundColor: 'white'}
                ]}>
                <TouchableOpacity onPress={() => this.showMenu()}>
                {this.renderIf2(this.state.initCheck, this.state.checkFinished,
                    <View style={styles.center}>
                    <Image
                    style={{width: 400, height: 400}}
                    source={require('./assets/checkFinal.gif')}
                    />
                    </View>,
                    <View style={styles.center}>
                    <Image
                    style={{width: 400, height: 400}}
                    source={require('./assets/checkStatic.jpg')}
                    />
                    </View>
                )}
                </TouchableOpacity>
                </View>,
                <View style={styles.center}>
                    <Expo.LinearGradient
                    colors={['#B5FAFF', '#EDFEFF', '#EDFEFF', '#EDFEFF']}
                    style={[{position: 'absolute', left: 0, right: 0, top: 0, height: Dimensions.get('window').height}, styles.center]}>
                        <Image
                        style={{width: 300, height: 300, resizeMode: 'contain'}}
                        source={require('./assets/lockFinal.gif')}
                        />
                        <Image style={{
                            height: 45,
                            resizeMode: 'contain'
                        }}
                        source={require('./assets/logo.png')}
                        />
                    </Expo.LinearGradient>
                </View>
            )
        )
    }
}

// <Button /*onPress={authFunction} style={[styles.button, styles.buttonBlue, styles.center]}*/>
// {this.state.waiting
//     ? 'Waiting for fingerprint... '
//     : 'Authenticate with fingerprint'}
//     </Button>

const styles = StyleSheet.create({
    image: {
        height: 500,
        width: 500
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    list: {
        width: Dimensions.get('window').width*0.9,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        padding: 4
    },
    userList: {
        width: Dimensions.get('window').width*0.9,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        padding: 8,
        paddingLeft: 16
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderColor: 'black'
    },
    containerFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    textBig: {
        fontSize: 36,
        textAlign: 'center',
        margin: 10,
    },
    button: {
        alignSelf: 'stretch',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5
    },
    buttonRed: {
        backgroundColor: '#FF585B',
    },
    buttonBlue: {
        backgroundColor: '#0074D9',
    },
    buttonGreen: {
        backgroundColor: '#2ECC40'
    },
    buttonLabel: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white'
    }
});
