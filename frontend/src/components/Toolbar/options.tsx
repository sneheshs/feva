import { useState } from 'react';

export default function Options() {
    const [show, setShow] = useState<boolean>(false);

    return (
        <div>
            
        </div>
//         let contents = [];
//         // 1. Write option title.
//         contents.push(
//             <div key={'option-title'} className={'option-title'}>
//                 {'Options'}
//             </div>
//         );
//         // 2. For every option objects
//         contents.push(this.props.info.map((item, i) => {
//             // 2.1. If item is slider, make slider.
//             if (item.type == 'slider') {
//                 return (
//                     <div key={item.text + i.toString()} className={'slider-container'}>
//                         <font className={'option-font text'}>{item.text}</font>
//                         <font className={`option-font value ${item.text.toLowerCase()}`}>{item.value}</font>
//                         <div className={'slider-input'}>
//                             <input
//                                 className={`slider-${item.text.toLowerCase()}`}
//                                 defaultValue={item.text == 'Interval' ? Math.log2(item.value) : item.value}
//                                 max={item.max}
//                                 min={item.min}
//                                 name={item.text.toLowerCase()}
//                                 step={1}
//                                 type={'range'}
//                                 onMouseUp={this.up}
//                                 onChange={this.change}
//                                 onKeyUp={this.arrowKey} />
//                         </div>
//                     </div>
//                 );
//             }
//             // 2.2. Else if item is toggle, make toggle button.
//             else if (item.type == 'toggle') {
//                 return (
//                     <div key={item.text + i.toString()} className={'toggle-container'}>
//                         <font className={'option-font text'}>{item.text}</font>
//                         <div className={'switch-container'}>
//                             <label className={'switch'}>
//                                 <input className={`input ${item.id} ${item.family}`}
//                                     type={'checkbox'}
//                                     disabled={false}
//                                     defaultChecked={item.default == 1 ? true : false}
//                                     onChange={() => interfaceManager.toolbarManager.toggle(item.id)} />
//                                 <span className={`slider ${item.id} ${item.family}`} />
//                             </label>
//                         </div>
//                     </div>
//                 );
//             } else {
//                 return;
//             }
//         }));
//         // 3. Add shutdown button.
//         contents.push(
//             <button key={'button-close'} className={`toolbar-button close`} onClick={processManager.buttons['close']} />
//         )
//         return (
//             <div className={'option-container'}>
//                 <button className={'toolbar-button option'}
//                     onClick={this.toggle} />
//                 <div className={'option-list'}>
//                     {contents}
//                 </div>
//             </div>
//         )
    )

//         // Update and check whether config window is open or not.
//         if (!this.state.isToggleOn) {
//             this.setState({
//                 isToggleOn: true
//             })

//             // If an input componenet is clicked we set the active element focus on that component.
//             let inputs = document.getElementsByClassName('option-list')[0].getElementsByTagName('input')
//             for (let i of inputs) {
//                 i.onclick = (e) => {
//                     i.focus()
//                 }
//             }
//         }
//         else {
//             this.setState({
//                 isToggleOn: false
//             })
//             document.activeElement.blur()
//         }
//     }




//     /**
//      * Mouse change function for sliders.
//      */
//     change(e) {
//         e.target.getAttribute('name') == 'interval' ?
//             $(`.option-font.value.${e.target.getAttribute('name')}`)[0].innerText = Math.pow(2, e.target.value) :
//             $(`.option-font.value.${e.target.getAttribute('name')}`)[0].innerText = e.target.value;
//     }
//     /**
//      * Function to change config values server side when
//      * slider values are changed.
//      */
//     updateSlider(e) {
//         // 1. Get config tag for slider.
//         const tag = interfaceManager.toolbarManager.sliders[e.target.getAttribute('name')].config;
//         // 2. If value changes
//         if (e.target.value != variableManager.configs(tag)) {
//             // 2.1. Write into config.
//             variableManager.configs(tag, e.target.value);
//             // 2.2. Run function for slider.
//             interfaceManager.toolbarManager.sliders[e.target.getAttribute('name')].func();
//         }
//         // 3. Else if doesn't, do nothing.
//     }
//     /**
//      * Mouse up function for sliders.
//      */
//     up = (e) => {
//         this.updateSlider(e);
//     }
//     /**
//      * Arrow key function for sliders.
//      */
//     arrowKey = (e) => {
//         if (e.key == 'ArrowRight' || e.key == 'ArrowLeft' || e.key == 'ArrowDown' || e.key == 'ArrowUp') {
//             this.updateSlider(e);
//         }
//     }
//     /** 
//      * Render Option Button on tool bar.
//      */
//     render() {
//     }
// }
};