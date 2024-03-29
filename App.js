import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from "react";
import {Audio} from 'expo-av';

export default function App() {
    //state declarations
    const [flashLights, setFlashLights] = useState([0, 1, 2, 3]);
    const [gameStatus, setGameStatus] = useState("");
    const [dialedLights, setDialedLights] = useState([]);
    const [colorLights, setColorLights] = useState(["#FF5733", "#3399FF", "#33FF57", "#9966FF"]);

    const [selectedLights, setSelectedLights] = useState([]);
    const [recordingLights, setRecordingLights] = useState([]);

    const [stage, setStage] = useState({ index: 1, flashes: 3 });
    const [flashes, setFlashes] = useState([]);
    const [blinkingIndex, setBlinkingIndex] = useState(-1);
    const [soundObject, setsoundObject] = useState(null);

    //getting random light
    function getRandomLight() {
        return colorLights[Math.floor((Math.random() * colorLights.length))];
    }

    function getRandomDial() {
        return flashLights[Math.floor((Math.random() * flashLights.length))];
    }

    const levelUp = () => {
        setDialedLights([]);
        setStage({ index: stage.index + 1, flashes: stage.flashes + 1 });
    }
     //function to start recording
    const startRecording = () => {
        setRecordingLights([]);
        setGameStatus("Recording...");
    }
    //function to stop recording
    const stopRecording = () => {
        setGameStatus("Stoped");
    }
    //function to handle pressed lights
    const lightPressed = async (light) => {
        console.log("lightpressed");
        const newDialedLights = [...dialedLights, light.soundObject];
        const newRecordingLights = [...recordingLights, light.soundObject];

        setDialedLights(newDialedLights);
        setRecordingLights(newRecordingLights);
        const soundFilePath = require('./assets/sounds/click.mp3');
        const { sound } = await Audio.Sound.createAsync(soundFilePath);
        setsoundObject(sound);
        try {
           
                console.log("Playing");
                await soundObject.playAsync();
               
         
            
        } catch (error) {
            console.error('Failed to play the sound', error);
        }
    

        if (newRecordingLights.length === 3) {
            setGameStatus("You made a banger!");
        }
    };
   
    const AppButton = ({ onPress, title }) => (
        <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
            <Text style={styles.appButtonText}>{title}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        const initialSelectedLights = [];
        for (let i = 0; i < flashLights.length; i++) {
            initialSelectedLights.push({ color: getRandomLight(), sound: i + 1 });
        }
        setSelectedLights(initialSelectedLights);
    }, []);

    const Light = ({ onPress, index }) => {
        const { color, sound } = selectedLights[index];
        const isBlinking = index === blinkingIndex;

        return (
            <TouchableOpacity
                onPress={onPress}
                style={[
                    styles.light,
                    { backgroundColor: color },
                    isBlinking ? styles.blinked : styles.stayed
                ]}
            >
                <Text style={styles.lightText}>
                    {`Sound ${sound}`}
                </Text>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.title}>Welcome to my sound board!</Text>
            <Text>Tap the circles to play!</Text>
            <Text>{gameStatus}</Text>
            <Text>Level: {stage.index}, {stage.flashes} clicks</Text>
            <View style={styles.lightsContainer}>
                {selectedLights.map((l, i) => <Light key={i} index={i} onPress={() => { lightPressed(l) }} />)}
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton onPress={startRecording} title="Start Recording" />
                <AppButton onPress={stopRecording} title="Stop Recording" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
    },
    blinked: {
        opacity: .8,
        elevation: 8,
    },
    stayed: {
        opacity: .5,
        elevation: 0,
    },
    lightsContainer: {
        flex: 0.5,
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: 50,
    },
    light: {
        height: 100,
        width: 100,
        borderRadius: 100,
        margin: 10,
        opacity: 0.5,
    },
    lightText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#fff',
    },
    appButtonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 10,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});