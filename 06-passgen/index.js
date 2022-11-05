document.addEventListener("DOMContentLoaded", () => {
  let password = ""

  const trackTime = (callback) => {
    const start = window.performance.now()

    callback()

    const end = window.performance.now()

    document.querySelector("#runTime").textContent = `run in ${
      end - start
    } nanoseconds`
  }

  const copyToClipboard = () => {
    const $result = document.querySelector("#result")
    const text = $result.textContent

    if (!text) return

    if (!navigator.clipboard) {
      $result.select()
      document.execCommand("copy")
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        $pw.classList.add("copied")

        $pw.querySelector("button").innerHTML = "copied"
      })
      .catch((e) => console.error(e))
  }

  const returnRandomChar = (list) => {
    return list[Math.floor(Math.random() * list.length)]
  }

  const getRandomValue = () => {
    const output = []

    const uppercase = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
    const lowercase = "abcdefghijklmnñopqrstuvwxyz"
    const numbers = "1234567890"
    const symbols = "!@#$%^&*."

    const includesUpper = $passgenForm.querySelector("#upperCase").checked
    const includesLower = $passgenForm.querySelector("#lowerCase").checked
    const includesNumber = $passgenForm.querySelector("#number").checked
    const includesSymbol = $passgenForm.querySelector("#symbol").checked

    if (includesUpper) output.push(returnRandomChar(uppercase))
    if (includesLower) output.push(returnRandomChar(lowercase))
    if (includesNumber) output.push(returnRandomChar(numbers))
    if (includesSymbol) output.push(returnRandomChar(symbols))

    return output.length > 0
      ? output[Math.floor(Math.random() * output.length)]
      : ""
  }

  const passgen = (e) => {
    if (e) e.preventDefault()

    $pw.classList.remove("copied")
    $pw.querySelector("button").innerHTML = "copy"

    trackTime(() => {
      const length = parseInt(
        $passgenForm.querySelector("#passwordLength").value
      )

      const output = Array(length)
        .fill(null)
        .map(() => getRandomValue())
        .join("")

      password = output
      document.querySelector("#result").textContent = output
    })
  }

  // Events
  const $passgenForm = document.querySelector("#passgenForm")
  $passgenForm.addEventListener("submit", passgen)

  const $pw = document.querySelector("#pw")
  $pw.addEventListener("click", copyToClipboard)

  const showHidePass = () => {
    const $showResult = document.querySelector("#showResult")

    if ($showResult.checked) {
      document.querySelector("#result").textContent = password
    } else {
      const len = password.length
      document.querySelector("#result").textContent = Array(len)
        .fill("*")
        .join("")
    }

    requestAnimationFrame(showHidePass)
  }

  requestAnimationFrame(showHidePass)

  // main
  passgen()
})
