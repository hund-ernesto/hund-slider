# hund-slider
 
Slider component built with React for our development purposes, but it is free to use if you like it.

## Documentation

### Installation

Looking forward to insert this module inside npm we are still testing and improving it but, for now you can download this repository, copy the dist folder to your project and rename it `hund-slider`.

### Examples

By now you can find some exaple code inside the [examples folder](examples)

### Usage

Final **props** and **methods** are still not defined yet but you can manage the slider behaviour using a `<Slider settings={ variable_name }>` prop which must follow this convention:

```javascript
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
```

### Development

By downloading the entire repository you will be able to run you own playground to test it.

```bash
git clone https://github.com/hund-ernesto/hund-slider
cd hund-slider
npm install
npm start
open http://localhost:8080
```