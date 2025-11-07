# react-tts
A flexible [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis#browser_compatibility) adapter for React.
- ### [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis#browser_compatibility)
- ### [Examples](https://github.com/rosealexander/react-tts/tree/main/example#readme)
## Use
`npm install react-tts` or `yarn add react-tts`
___
## Components
### TtsButton
#### props - includes `TtsBase` props
- **cancel**
  - component returned when variant is set as `'cancel'`
- **pause** 
  - component returned when variant is set as `'pause'`
- **resume**
  - component returned when variant is set as `'resume'`
- **speak**
  - component returned when variant is set as `'speak'`
- **variant**
    - `'cancel' | 'speak' | 'pause' | 'resume'` defaults to 'speak'
    
### Tts
Higher-order component provides onClick `TtsBase` functionality.
#### props - includes `TtsBase` props
- **variant**
    -   `'cancel' | 'speak' | 'pause' | 'resume'` defaults to 'speak'

### TtsBase
forwardRef functional component, see [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)
#### props
- **Component**
    - The component used for the root node. Defaults to `<div />`
- **children**
    - The content of the component.
- **autoplay**
    - Tts will autoplay content, defaults to `false`
- **lang**
    - Speech language, defaults to `document.documentElement.lang`
- **onEnd**
    - callback when finished speaking.
- **onError**
    - callback when error occurs preventing speaking.
- **onPause**
    -  callback when speaking is paused.
- **onResume**
    - callback when paused speaking is resumed.
- **onStart**
    - callback when speaking is started.
- **pitch**
    - Float representing the pitch value between 0-2, defaults to 1.
- **rate**
    - Float representing the rate value between 0.1-10, defaults to 1.
- **text**
    - String value that is spoken and prioritized over children text content if set.
- **voice**
    - The speech voice, defaults to lang default.
- **volume**
    - Float representing volume between 0-1, defaults to 1.
____
[![MIT License][license-shield]][license-url] 

[license-shield]: https://img.shields.io/github/license/rosealexander/react-tts.svg?style=for-the-badge
[license-url]: https://github.com/rosealexander/react-tts/blob/master/LICENSE
