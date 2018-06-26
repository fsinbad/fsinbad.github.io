const MARKER = '$> '

let $elem = (id) => document.getElementById(id)
let $on = (e, elem, f) => elem.addEventListener(e, f)
let $create = (tag) => document.createElement(tag)
let $class = (className, elem) => elem.classList.add(className)
let $remClass = (className, elem) => elem.classList.remove(className)
let $append = (child, elem) => elem.append(child)
let $remove = (child, elem) => elem.contains(child) && elem.removeChild(child)
let $setHtml = (text, elem) => { elem.innerHTML = text }
let $value = (value, elem) => { elem.value = value }
let $insertBefore = (sibling, elem, parent) => parent.insertBefore(sibling, elem)

let spaces = (x) => ('&nbsp;').repeat(x)

$on('load', window, () => {
  let $terminal = $elem('terminal')
  let $display = $elem('display')
  let $writerContainer = $elem('writer-container')
  let $writer = $elem('writer')
  let $bottom = $elem('wrapper-bottom')
  let $projects = $elem('projects')
  let $timeline = $elem('timeline')
  let $skills = $elem('skills')

  let writeLine = (text) => {
    let $row = $create('div')
    let $text = $create('span')
    $class('row', $row)
    $setHtml(text, $text)
    $append($text, $row)
    $insertBefore($row, $writerContainer, $display)
    $value(MARKER, $writer)
    $display.scrollTop = $display.scrollHeight
  }

  let outputHelp = () => {
    let line = (cmd, help) => cmd + spaces(12 - cmd.length) + help
    let lines = [
      line('help', 'output this help menu'),
      line('projects', 'display recent projects'),
      line('timeline', 'see my timeline'),
      line('skills', 'view programming skills'),
      line('clear', 'clear the terminal display')
    ]
    lines.forEach(writeLine)
  }

  let clear = () => {
    $setHtml('', $display)
    $append($writerContainer, $display)
    $writer.focus()
  }

  let showProjects = () => {
    hideAll()
    $append($projects, $bottom)
    setTimeout(() => $class('shown', $projects))
  }

  let showTimeline = () => {
    hideAll()
    $append($timeline, $bottom)
    setTimeout(() => $class('shown', $timeline))
  }

  let showSkills = () => {
    hideAll()
    $append($skills, $bottom)
    setTimeout(() => $class('shown', $skills))
  }

  let hideAll = () => {
    $remClass('shown', $projects)
    $remove($projects, $bottom)
    $remClass('shown', $timeline)
    $remove($timeline, $bottom)
    $remClass('shown', $skills)
    $remove($skills, $bottom)
  }

  let execute = ([command]) => {
    switch (command) {
      case 'help': return outputHelp()
      case 'clear': return clear()
      case 'projects': return showProjects()
      case 'timeline': return showTimeline()
      case 'skills': return showSkills()
      case 'hide': return hideAll()
      case '': break
      default: writeLine(`${command}: command not found, try typing "help"`)
    }
  }

  $value(MARKER, $writer)

  $on('keydown', $writer, (event) => {
    let { value } = event.target
    if (event.code === 'Enter') {
      writeLine(value)
      execute(value.replace(MARKER, '').trim().split(' '))
    } else if (value === MARKER && event.code === 'Backspace') {
      event.preventDefault()
    }
  })

  $on('click', $terminal, () => $writer.focus())
  $remove($projects, $bottom)
  $remove($timeline, $bottom)
  $remove($skills, $bottom)
  $writer.focus()
})
