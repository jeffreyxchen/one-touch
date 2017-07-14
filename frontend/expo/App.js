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
import Expo from 'expo';

function Button(props) {
    return (
        <TouchableOpacity
        onPress={props.onPress}
        style={[styles.button, props.style]}>
        <Text style={styles.buttonText}>{props.children}</Text>
        </TouchableOpacity>
    );
}

export default class App extends React.Component {
    state = {
        waiting: false,
        validated: false
    };
    componentDidMount() {
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
                    'Use Touch ID to log in!'
                );
                if (result.success) {
                    this.setState({
                        validated: true
                    })
                } else {
                    AlertIOS.alert('Could not validate fingerprint');
                }
            };
        }
        authFunction();
    }
    renderIf(condition, content) {
        if (condition) {
            return content;
        } else {
            return null;
        }
    }
    showCheck() {
        console.log('showing check');
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx={26} cy={26} r={25} fill="none"/>
        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
    }
    render() {
        this.state.validated ? this.showCheck() : console.log("weiners")
        return (
            <View style={[
                {flex: 1},
                styles.center,
                {backgroundColor: this.state.validated ? 'white' : '#ff4d4d'}
            ]}>
            {this.renderIf(this.state.validated,
                <View style={styles.center}>
                <Text>This should be above the image</Text>
                <Image
                    style={{width: 250, height: 250}}
                    source={{uri: 'https://media.giphy.com/media/8GY3UiUjwKwhO/giphy.gif'}}
                />
                </View>
            )}
            </View>
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
