import React from 'react';
import App from './App';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {HelloWorld} from "./HelloWorld";

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  shallow(<App />);
});

it('renders a hello world component inside the app', () => {
  const app = shallow(<App />);
  expect(app.contains(<HelloWorld/>)).toEqual(true);
})

