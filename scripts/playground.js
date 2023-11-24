const clearAllTimers1 = () => {
  let timer = setTimeout(() => { }, 10000);
  while (timer && timer._idlePrev) {
    console.log('+1', timer[Symbol.toPrimitive]?.())
    let prev = timer._idlePrev;
    clearTimeout(timer);
    timer = prev;
  }
}


setTimeout(() => console.log('231'), 1000);

clearAllTimers1();
// clearAllTimers2();