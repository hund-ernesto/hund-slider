import React from 'react'
import ReactDOM from 'react-dom';

import { Slider, Slide } from './../src'

import './index.scss'

const settings = {
    infinite: true,
    focusOnSelect: true,
    onSlideClick: `goToNext`,
    onTransitionEnd: () => console.log( `onTransitionEnds` ),
    responsive: [
        {
        breakpoint: 1024,
        settings: {
            infinite: true,
            onSlideClick: () => console.log( `onSlideClickDesktop` ),
            onTransitionEnd: () => console.log( `onTransitionEndsDesktop` ),
            focusOnSelect: true,
        }
        },
        {
        breakpoint: 834,
        settings: {
            infinite: true,
            onSlideClick: () => console.log( `onSlideClickTablet` ),
            onTransitionEnd: () => console.log( `onTransitionEndsTablet` ),
        }
        }
    ]
}

const App = () => {
    return(
        <div className={ `app` } >
            <Slider settings={ settings } >
                <Slide style={ { background: `gray` } } >1</Slide>
                <Slide style={ { background: `darkgray` } } >2</Slide>
                <Slide style={ { background: `lightgray` } } >3</Slide>
            </Slider>
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);