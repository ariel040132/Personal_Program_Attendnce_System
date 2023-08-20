const complexArray = [
  { id: 1, name: 'Alice', age: 28, hobbies: ['reading', 'painting'], address: { city: 'New York', zip: '10001' } },
  { id: 2, name: 'Bob', age: 35, hobbies: ['gaming', 'cooking'], address: { city: 'Los Angeles', zip: '90001' } },
  { id: 3, name: 'Charlie', age: 22, hobbies: ['traveling', 'photography'], address: { city: 'San Francisco', zip: '94101' } },
  { id: 4, name: 'David', age: 40, hobbies: ['gardening', 'music'], address: { city: 'Chicago', zip: '60601' } },
  { id: 5, name: 'Eva', age: 29, hobbies: ['hiking', 'yoga'], address: { city: 'Seattle', zip: '98101' } },
  { id: 6, name: 'Frank', age: 26, hobbies: ['movies', 'swimming'], address: { city: 'Miami', zip: '33101' } },
  { id: 7, name: 'Grace', age: 32, hobbies: ['dancing', 'shopping'], address: { city: 'Houston', zip: '77001' } },
  { id: 8, name: 'Helen', age: 23, hobbies: ['writing', 'volunteering'], address: { city: 'Boston', zip: '02101' } },
  { id: 9, name: 'Isaac', age: 31, hobbies: ['coding', 'cycling'], address: { city: 'San Diego', zip: '92101' } },
  { id: 10, name: 'Jane', age: 37, hobbies: ['cooking', 'reading'], address: { city: 'Austin', zip: '73301' } },
  { id: 11, name: 'Kevin', age: 25, hobbies: ['painting', 'traveling'], address: { city: 'Denver', zip: '80201' } },
];

const list = complexArray.map(array => {
  return {
    age: array.age,
    name: array.name
  }
})
console.log(list);