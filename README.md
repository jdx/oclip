# oclip

## API Documentation

```
Defined in file:///Users/jdxcode/src/oclip/src/error.ts:61:0 

class InvalidChoiceError extends OclipError

  constructor(choices: string[], input: string)
  choices: string[]
  input: string

Defined in file:///Users/jdxcode/src/oclip/src/error.ts:23:0 

class MultipleArgNotLastError extends ValidationError

  constructor(arg: arg.MultipleArg<any>, next: arg.Arg<any>)

Defined in file:///Users/jdxcode/src/oclip/src/error.ts:5:0 

abstract class OclipError extends Error


Defined in file:///Users/jdxcode/src/oclip/src/error.ts:8:0 

class RequiredArgAfterOptionalValidationError extends ValidationError

  constructor(optional: arg.Arg<any>, required: arg.Arg<any>)

Defined in file:///Users/jdxcode/src/oclip/src/error.ts:36:0 

class RequiredArgsError extends OclipError

  constructor(args: arg.List)
  args: arg.List

Defined in file:///Users/jdxcode/src/oclip/src/error.ts:50:0 

class UnexpectedArgsError extends OclipError

  constructor(args: string[])
  args: string[]

Defined in file:///Users/jdxcode/src/oclip/src/error.ts:6:0 

abstract class ValidationError extends OclipError



```
Made by Jeff Dickey
