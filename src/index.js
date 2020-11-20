import React from 'react'
import gsap from 'gsap'

import './index.scss'

const Slide = ( { children, registerSlide, slides, index, onClick, className, ...rest } ) => {
    const container = React.useRef( null )

    React.useEffect( () => {
        registerSlide && registerSlide( { start: container.current.clientWidth * index } )
    } )

    const handleClick = () => {
        onClick[0] && onClick[0]( index )
        onClick[1] && onClick[1]( )
    }

    return(
        <div ref={ container } onClick={ handleClick } className={ [ `slider-stage-slide`, className ].join( ` ` ) } { ...rest } >
            { children }
        </div>
    )
}

class Slider extends React.Component {
    constructor( props ) {
        super( props )

        // Container 
        this.container = React.createRef()
        this.stage = React.createRef()

        // States 
        this.state = {
            length: this.props.children.length - 1,
            width: 0,
            current: 0,
            settings: 0,
            elements: [],
            points: [],
        }

        // Helpers
        this.pointsRef = React.createRef( this.state.points )
    }

    /**
     * Methods
     */

    // Responsive stuff
    
    checkBreakpoints = () => {
        this.props.settings.responsive
            ? this.props.settings.responsive.length > 0
                ? this.setState( { settings: this.selectResponsiveSettings() } )
                : this.setState( { settings: this.props.settings } )
            : this.setState( { settings: this.props.settings } )
    }

    selectResponsiveSettings = () => {
        let queryFound = null;

        this.props.settings.responsive.sort( ( prev, next ) => {
            if ( prev.breakpoint < next.breakpoint ) return -1
            if ( prev.breakpoint > next.breakpoint ) return 1
            return 0
        } )

        this.props.settings.responsive.map( ( query, index ) => {
            if ( this.state.width > query.breakpoint ) queryFound = query.settings
        } )

        return queryFound ? queryFound : this.props.settings
    }

    // Resizing 

    handleResize = () => {
        this.setState( { width: window.innerWidth } )
    }

    // Setup

    registerSlide = ( slide ) => {
        this.pointsRef.current = [ ...this.pointsRef.current, slide ]
    }

    setCurrent = ( index ) => {
        this.setState( { current: index } )
    }

    setup = () => {
        let tmp = []
        this.pointsRef.current = []

        let onClick = [
            this.state.settings.onSlideClick !== `goToNext` 
                && this.state.settings.focusOnSelect 
                    ? this.setCurrent
                    : null,
            this.state.settings.onSlideClick 
                ? this.state.settings.onSlideClick === `goToNext`
                    ? this.nextSlide
                    : this.state.settings.onSlideClick
                : null,
        ]

        this.props.children.map( ( child, index ) => { 
            tmp.push( React.cloneElement(
                child,
                { 
                    registerSlide: this.registerSlide,
                    index: index, 
                    key: index,
                    onClick: onClick,
                }
            ) )
        } )

        this.state.settings.infinite
            && this.props.children.map( ( child, index ) => { 
                tmp.push( React.cloneElement(
                    child,
                    { 
                        registerSlide: index < 1 && this.registerSlide,
                        index: this.props.children.length + index, 
                        key: this.props.children.length + index,
                        onClick: onClick,
                    }
                ) )
            } )

        this.setState( { elements: tmp } )
    }

    update = ( current ) => {
        this.pointsRef.current = []

        this.stage.current.querySelectorAll( `.slider-stage-slide` ).forEach( ( slide, index ) => {
            this.pointsRef.current.push( { start: slide.clientWidth * index } )
        } )

        this.pointsRef.current.length > 0
            && gsap.to( this.stage.current, { 
                duration: 0, 
                ease: 'step', 
                x: this.pointsRef.current[ current ].start * -1
            } )
    }

    modifyChildrenClasses = ( child, index ) => {
        return React.cloneElement(
            child,
            {
                ...child.props,
                className: [ `hund-slide`, `hund-slide--${ index === this.state.current ? `is-current` : `not-current` }` ].join( ` ` )
            }
        )
    }

    // Navigation 

    prevSlide = () => {
        this.state.current > 0
            ? this.setState( { current: this.state.current - 1 } )
            : this.setState( { current: 0 } )
    }

    nextSlide = () => {
        this.state.settings.infinite
        ? this.state.current < this.pointsRef.current.length - 1
            ? this.setCurrent( this.state.current + 1 )
            : this.setCurrent( 0 ) 
        : this.state.current < this.pointsRef.current.length - 1
            ? this.setCurrent( this.state.current + 1 )
            : this.setCurrent( this.pointsRef.current.length - 1 ) 
    }

    animate = ( current, callback ) => {
        let value = this.pointsRef.current[ current ].start * -1
        gsap.to( this.stage.current, { 
            duration: .2, 
            ease: 'ease', 
            x: value,
            onComplete: () => {
                callback ? callback() : console.log( `no call` )
                this.state.settings.onTransitionEnd && this.state.settings.onTransitionEnd()
            }
        } )
    }

    jump = () => {
        this.state.current > this.state.length
         && ( () => {
            console.log( `jump` )

            gsap.to( this.stage.current, { 
                duration: 0, 
                ease: 'step', 
                x: 0,
                onComplete: () => {
                    this.setCurrent( 0 )
                }
            } )
        } )()
    }

    /**
     * Routine
     */

    render = () => {
        return(
            <div ref={ this.container } className={ `slider` } >
                {
                    this.state.settings.buttons && (
                        <>
                            <button onClick={ this.prevSlide } >Prev</button>
                            <button onClick={ this.nextSlide } >Next</button>
                        </>
                    )
                }
                <div ref={ this.stage } className={ `slider-stage` } >
                    { this.state.elements.map( ( child, index ) => this.modifyChildrenClasses( child, index ) ) }
                </div>
            </div>
        )
    }

    componentDidMount = () => {
        this.handleResize()
        window.addEventListener( `resize`, this.handleResize )
    }

    componentDidUpdate = ( prevProps, prevState, snapshot ) => {
        prevState.width !== this.state.width
            && this.checkBreakpoints()

        prevState.width !== this.state.width
            && this.update( this.state.current ) // Only recalculate points

        prevState.settings !== this.state.settings
            && this.setup() // Repaint children

        this.pointsRef.current
            && this.pointsRef.current.length > 0
                && prevState.current !== this.state.current
                    && this.animate( 
                        this.state.current, 
                        this.jump 
                    )
    }

    componentWillUnmount = () => {
        window.removeEventListener( `resize`, this.handleResize )
    }
}

export { Slider as Slider, Slide as Slide }