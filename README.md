# ARRP
ARRP (Array Processing) is a LISP-like Programing Language on JavaScript.

WIP

## Trivial REPL

```
$ git clone https://github.com/myaosato/arrp.git
$ cd arrp
$ npm arrpi

> arrp@0.1.0 arrpi /arrp/parent/dir/path/arrp
> node ./test/arrpi.js

ARRP > (+ 1 2 3)
6
ARRP > (defun fact (num)
.... >    (if (<= num 1)
.... >        1
.... >        (* num (fact (- num 1)))))
ArrpFunction {
  env: Map {},
  params: [ Symbol#<num> ],
  body: [ Symbol#<progn>, [ Symbol#<if>, [Array], 1, [Array] ] ] }
ARRP > (fact 5)
120
ARRP> (setg! answer 10)
10
ARRP> answer
10
ARRP> (exit)

Bye

$
```

## License

Licensed under the MIT License.
