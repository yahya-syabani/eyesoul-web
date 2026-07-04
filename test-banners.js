async function run() {
  const res = await fetch('http://localhost:3000/api/homepage-banners?limit=10&sort=order&depth=2')
  const json = await res.json()
  console.log(JSON.stringify(json.docs[0], null, 2))
}
run()
