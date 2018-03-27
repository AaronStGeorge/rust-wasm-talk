const js = import("./rust_wasm_talk");

import { Terminal } from 'xterm'
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen'

const ENTER = 13
const BACKSPACE = 8
const UPARROW = 38
const DOWNARROW = 40

// global variable
var term

export function out (s) {
  term.write('\x1B[1;32m' + s + '\x1B[0m' + '\r\n')
}

export function err (s) {
  term.write('\x1B[1;31m' + s + '\x1B[0m' + '\r\n')
}

function printLogo () {
  term.writeln(`\x1B[1;32m                   __    _____  _  _`)
  term.writeln(`                  (  )  (  _  )( \\\/ )`)
  term.writeln(`  /\\-/\\            )(__  )(_)(  )  (`)
  term.writeln(` /a a  \\          (____)(_____)(_/\\_)  _`)
  term.writeln(`=\\ Y  =/-~~~~~~-,_____________________/ )`)
  term.writeln(`  '^--'          ______________________/`)
  term.writeln(`    \\           /`)
  term.writeln(`    ||  |---'\\  \\ `)
  term.writeln(`   (_(__|   ((__|`)
  term.writeln(`catlox is free software with ABSOLUTELY NO WARRANTY. \x1B[0m`)
}

function clearLineToPrompt (shellprompt) {
  for (var i = term.buffer.x; i >= shellprompt.length + 1; i--) {
    term.write('\b \b')
  }
}

function main (js) {
  var commandHistory = []
  var historyIndex = -1
  var interpreter = js.LoxInterpreter.new()
  window.interpreter = interpreter
  Terminal.applyAddon(fullscreen)

  var terminalContainer = document.getElementById('terminal-container')
  term = new Terminal({
    cursorBlink: true,
    scrollback: 10000,
    tabStopWidth: 4,
    fontFamily: 'monospace'
  })
  window.term = term // Expose `term` to window for debugging purposes

  term.open(terminalContainer)
  term.toggleFullScreen(true)

  var shellprompt = '> '

  var currentline = ''

  term.prompt = function () {
    term.write('\r\n')
    if (currentline.length !== 0) {
      interpreter.run(currentline)
      commandHistory.push(currentline)
      historyIndex = commandHistory.length - 1
      currentline = ''
    }
    term.write(shellprompt)
  }

  printLogo()
  term.writeln('')
  term.write(shellprompt)

  var previousCurrentLine

  term.on('key', function (key, ev) {
    var isArrowKey = ev.keyCode >= 37 && ev.keyCode <= 40
    var isPrintableChar = (
      !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
    )
    var hasHistory = commandHistory.length !== 0

    if (ev.keyCode === ENTER) {
      term.prompt()
    } else if (ev.keyCode === UPARROW && historyIndex >= 0 && hasHistory) {
      if (historyIndex === commandHistory.length - 1 && previousCurrentLine === null) {
        previousCurrentLine = currentline
      }

      clearLineToPrompt(shellprompt)

      term.write(commandHistory[historyIndex])
      currentline = commandHistory[historyIndex]

      if (historyIndex > 0) {
        historyIndex--
      }
    } else if (ev.keyCode === DOWNARROW && historyIndex < commandHistory.length - 1 && hasHistory) {
      clearLineToPrompt(shellprompt)

      if (historyIndex < commandHistory.length - 1) {
        historyIndex++
      }

      term.write(commandHistory[historyIndex])
      currentline = commandHistory[historyIndex]
    } else if (ev.keyCode === DOWNARROW && historyIndex === commandHistory.length - 1 && hasHistory) {
      if (previousCurrentLine !== null) {
        clearLineToPrompt(shellprompt)

        term.write(previousCurrentLine)
        currentline = previousCurrentLine
        previousCurrentLine = null
      }
    } else if (ev.keyCode === BACKSPACE) {
      // Do not delete the prompt
      if (term.buffer.x > shellprompt.length) {
        term.write('\b \b')
        currentline = currentline.substring(0, currentline.length - 1)
      }
    } else if (isPrintableChar && !isArrowKey) {
      currentline += String.fromCharCode(ev.charCode)
      previousCurrentLine = null
      term.write(key)
    }
  })
}

js.then(main)
