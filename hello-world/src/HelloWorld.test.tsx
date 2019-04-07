import {configure, mount, shallow} from "enzyme";
import {HelloWorld} from "./HelloWorld";
import React from 'react'
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

it('renders a default hello message on creation', () => {
    const hw = shallow(<HelloWorld/>)
    const msg = <h1>Hello, world</h1>;
    expect(hw.contains(msg)).toEqual(true)
})

it('greets someone', () => {
    const wrapper = mount(<HelloWorld/>)

    wrapper.find('input')
        .simulate('change', {target: {value: 'Pepper'}})

    expect(wrapper.find('h1').text()).toEqual('Hello, Pepper');
})