import React, { useState } from 'react';
import recordAudio from '../helpers/recordAudio';
import speedRecognition from '../helpers/speedRecognition';

export default function () {
    const [phrases] = useState([
        'I love to sing ',
        'where are you going',
        'can I call you tomorrow',
        'why did you talk',
        'she enjoys reading books',
        'where are you going',
        'have a great day',
    ]);
    const [recorders, setRecorders] = useState([]);
    const refButtons = [];
    const setDisable = (index, value = true) => {
        const refB = refButtons[index] || false;
        if (refB) {
            value ? refB.setAttribute('disabled', value) : refB.removeAttribute('disabled');
        }
    }

    const processVoice = async (dataPhrase, indexButton) => {
        setDisable(indexButton);
        const recording = await recordAudio();
        const recognition = speedRecognition(dataPhrase);
        recognition.start();
        recording.start();

        recognition.onresult = event => {
            var speechResult = event.results[0][0].transcript.toLowerCase();
            console.log(speechResult);
        }

        recognition.onspeechend = async () => {
            recognition.stop();
            const resultRecording = await recording.stop();

            let arrRecorders = [...recorders];
            arrRecorders[indexButton] = resultRecording;
            setRecorders(arrRecorders);
        }
    }

    const handleClick = event => {
        const dataPhrase = event.target.getAttribute('data-phrase');
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        processVoice(dataPhrase, index);
    }

    const handlePlay = event => {
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        const data = recorders[index];
        data.play();
    }

    const handleReset = event => {
        const index = parseInt(event.target.getAttribute('data-index'), 10);
        setDisable(index, false);

        let arrRecorders = [...recorders];
        arrRecorders.splice(index);
        setRecorders(arrRecorders);
    }

    return <div>
        {
            phrases.length > 0 && phrases.map((el, index) => {
                return <div key={index}>
                    <button
                        ref={ref => refButtons[index] = ref}
                        data-index={index}
                        data-phrase={el}
                        onClick={handleClick}>{el}</button>
                    {
                        recorders[index] && <>
                            <button data-index={index} onClick={handlePlay}>Play</button>
                            <button data-index={index} onClick={handleReset}>Reset</button>
                        </>
                    }
                </div>
            })
        }
    </div>
}