const PATTERN =/^[a-z]+[0-9]+@[a-z]+(\.[a-z])/i
//const testValue = 'aBETteur'
const values = ['edosa45@gmail.com',
    'ebun25@yahoo.com',
     'asabe.yahoo.org',
     'nic@google.com',
   ]
values.forEach((value, index) => {
    const match = PATTERN.test(value)
console.log({index, value, match, length: value.length})
})
 
