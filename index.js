
const js = import("./rust_wasm_talk");

import { Terminal } from 'xterm'
import * as fullscreen from 'xterm/lib/addons/fullscreen/fullscreen'

const ENTER = 13
const BACKSPACE = 8
const line1 = `\x1B[1;32m                   __    _____  _  _`
const line2 = `                  (  )  (  _  )( \\\/ )`
const line3 = `  /\\-/\\            )(__  )(_)(  )  (`
const line4 = ` /a a  \\          (____)(_____)(_/\\_)  _`
const line5 = `=\\ Y  =/-~~~~~~-,_____________________/ )`
const line6 = `  '^--'          ______________________/`
const line7 = `    \\           /`
const line8 = `    ||  |---'\\  \\ `
const line9 = `   (_(__|   ((__|`
const line10 = `catlox is free software with ABSOLUTELY NO WARRANTY. \x1B[0m`

var term

export function out (s) {
  term.write('\x1B[1;32m' + s + '\x1B[0m' + '\r\n')
}

export function err (s) {
  term.write('\x1B[1;31m' + s + '\x1B[0m' + '\r\n')
}

function main (js) {
  var interpreter = js.LoxInterpreter.new()
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
    term.write('\r\n\r\n')
    interpreter.run(currentline)
    term.write('\r\n')
    currentline = ''
    term.write(shellprompt)
  }

  term.writeln(line1)
  term.writeln(line2)
  term.writeln(line3)
  term.writeln(line4)
  term.writeln(line5)
  term.writeln(line6)
  term.writeln(line7)
  term.writeln(line8)
  term.writeln(line9)
  term.writeln(line10)
  term.writeln('')
  term.write(shellprompt)

  term.on('key', function (key, ev) {
    var arrowKey = ev.keyCode >= 37 && ev.keyCode <= 40

    var printable = (
      !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
    )

    if (ev.keyCode === ENTER) {
      term.prompt()
    } else if (ev.keyCode === BACKSPACE) {
      // Do not delete the prompt
      if (term.buffer.x > 2) {
        // Write control code to move character left, then a space (replacig the
        // original character)
        term.write('\b \b')
        currentline = currentline.substring(0, currentline.length - 1)
      }
    } else if (printable && !arrowKey) {
      currentline += String.fromCharCode(ev.charCode)
      term.write(key)
    }
  })
}

js.then(main)
