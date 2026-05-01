---
applyTo: '**'
---

- Always answer in German and with a robot emoji 🤖 at the end.
- Write comments always in english.
- Never commit or push changes automatically in git.
- When answering questions about frameworks, libraries, or APIs, use Context7 to retrieve current documentation rather than relying on training data.
- If code changes make sense, always make them immediately. Don't ask again.
- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- For small changes make minimally invasive edits. Do not refactor, restructure, or clean up surrounding code unless the task requires it.
- Match comment density to the surrounding project. When in doubt, write no comment.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.

Section headings are tagged with the language or framework they apply to: `(PHP)`, `(JS/TS)`, `(Laravel)`, `(Symfony)`. Framework-tagged rules only apply when the project actually uses that framework — do not import Laravel helpers (`Str`, `Number`, `Carbon`, Eloquent `Model`, `withProgressBar`, `ConsoleOutputHelper`, jobs) into a plain PHP project.

### use strict types (PHP)

Always add `declare(strict_types=1);` at the top of PHP files. For new files, add it immediately. For existing files, fix them gradually.

```php
// bad
<?php
namespace App;

// good
<?php
declare(strict_types=1);
namespace App;
```

### code comments (PHP, JS/TS)

```php
// bad
// Dies ist ein Kommentar auf Deutsch

// bad
// This Is A Comment

// good
// this is a comment
```

### prevent stfu operator (PHP)

`@` suppresses errors silently. `__x()` is a legacy in-house wrapper around `@` (null-safe access without warnings). Both hide bugs — replace with `??` / `?->` chains.

```php
// bad
if(@$foo) {}
if(@$_GET['foo']) {}
if(__x($foo)) {}
if(__x($foo->bar()->baz)) {}

// good
if(($foo??'') === '') {}
if(($foo?->bar()?->baz??'') === '') {}
```

### prevent static classes (PHP)

Avoid static methods for stateful business logic. **Exempt** (still allowed): named constructors / factories (`UserDTO::create`, `Price::fromInteger`), framework facades and helpers (`Str::of`, `Carbon::now`, `Number::format`, `Model::factory`, `Job::dispatch`), enum cases (`Environment::Produktion`), constant access (`Foo::BAR`), and exception named constructors (`MyException::partNotFound`).

```php
// bad
Example::calculate($obj)

// good
(new Example($obj))->calculate()
```

### prevent static arguments (PHP)

```php
// bad
public static int $foo;

// good
public int $foo;
```

### loop namings (PHP, JS/TS)

```php
$countries = ['Europe' => 'Germany'];

// bad
foreach($countries as $countries__key => $countries__value) { }

// good
foreach($countries as $continent => $country) { }

$dataToTest = [7, 42];

// bad
foreach($dataToTest as $dataToTest__value) { }

// good
foreach($dataToTest as $testValue) { }
```

### prevent abbreviations (PHP, JS/TS)

```php
// bad
$model->calc()

// good
$model->calculate()
```

### cases (PHP, JS/TS)

```php
// camel case
$variableFooBar
function fooBarBaz() {}

// pascal case
class ExampleClass {}

// snake case
$variable_in_template
Foo::first()->variable_from_db
```

### prevent arrays (PHP)

```php
// bad
exampleFunction(['foo' => 'bar', 'bar' => 'baz'])

// good
exampleFunction(foo: 'bar', bar: 'baz')
```

### prevent arrays — anonymous objects (PHP)

```php
// bad
$foo = (object) ['foo' => 'bar', 'bar' => 'baz']; // anonymous object with properties 'foo' and 'bar'

// good
$foo = (new Foo())->foo('bar')->bar('baz')->get(); // Foo object with properties 'foo' and 'bar'
```

### use classes / use getters / prevent arrays (PHP)

```php
// bad
$mapping = getMapping('test'); // ['foo' => 42, 'bar' => 7]

// good
$mapping = (new MappingGetter())->value('test')->get(); // Mapping object
class Mapping {
    public ?int $foo;
    public ?int $bar;
}
class MappingGetter {
    public string $value;
    public function value($value) { $this->value = $value; return $this; }
    public function get() {
      $mapping = (new Mapping());
      $mapping->foo = 42;
      $mapping->bar = 7;
      /* ... more logic ... */
      return $mapping;
    }
}
```

### prevent monster classes / outsource in separate classes (PHP)

```php
// bad
$objectInBigModel->calculateSpecialValue();


// good
(new SpecialValueCalculator($objectInBigModel))->calculate()
```

### use dtos (PHP)

- DTOs (Data Transfer Objects) are little "packages" that hold data meant to be moved around
- the data is consistent, structured and typed
- they improve IDE support

```php
// bad
$userData = [
    'id' => 42,
    'name' => 'David',
    'email' => 'david@vielhuber.de'
];
print_r($userData['id']); // 42

// best (php >= 8.1)
$userData = UserDTO::create(
    42,
    'David',
    'david@vielhuber.de'
);
print_r($userData->id); // 42
class UserDTO {
    private function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email
    ) {}

    public static function create(int $id, string $name, string $email): UserDTO {
        // potentially modify data before storing
        // ...
        return new self($id, $name, $email);
    }
}

// good (php <8.1)
$userData = UserDTO::create(
    42,
    'David',
    'david@vielhuber.de'
);
print_r($userData->id()); // 42
class UserDTO {
    private int $id;
    private string $name;
    private string $email;
    private function __construct(int $id, string $name, string $email) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }
    public static function create(int $id, string $name, string $email): UserDTO {
        // potentially modify data before storing
        // ...
        return new self($id, $name, $email);
    }
    public function id(): int {
        return $this->id;
    }
    public function name(): string {
        return $this->name;
    }
    public function email(): string {
        return $this->email;
    }
}
```

### use vos (PHP)

- VOs (value objects) represent one or multiple values
- Cannot be changed once instantiated
- Validate the value when instantiating
- Have methods that convert, compare or format the value
- DTOs and VOs serve different purposes and actually complement each other very well
    - DTOs transfer data (carry data between layers or systems, without holding much logic or responsibility)
    - VOs ensure the integrity of data (focus on modeling concepts within your domain)

```php
// bad
$price = (float) 42;
$price = '$'.number_format($price/100, 2);
echo $price;

// good
$price = Price::fromInteger(42);
$price->formattedWithSymbol();
$price->value();
final readonly class Price
{
  public function __construct(private int $value) {
    if ($value < 0) {
      throw new PriceCannotBeBelowZero();
    }
  }
  public static function fromInteger(int $value): self {
    return new self($value);
  }
  private function convertToDollars(): float {
    return $this->value / 100;
  }
  public function formattedWithSymbol(): string {
    return '$' . number_format($this->convertToDollars(), 2);
  }
  public function value(): int {
    return $this->value;
  }
}
```

### use constants (PHP)

```php
// bad
$threshold = 42;
$anotherValue = $threshold + 7;

// good
class ExampleModel {
    public const THRESHOLD_VALUE = 40;
}
$anotherValue = ExampleModel::THRESHOLD_VALUE + 7;
```

### function chaining (PHP)

```php
// bad
$value = $foo->calculate(save: true);

// good
$foo->save()->calculate()->getValue();

// bad
(new Foo(data: 'bar'))->calculate()

// good
(new Foo())->setData(data: 'bar')->calculate()
```

### use framework functions (Laravel)

```php
// bad
$str = trim($str);
$str = mb_strtoupper($str);
$str = str_replace(' ', '', $str);

// good
$str = Str::of($str)->trim()->upper()->replace(' ', '')->toString();

// bad
$num = number_format($num, 4, '.', ',')

// good
$num = Number::format($num, precision: 4, locale: 'de')
```

### prevent duplicate database calls (Laravel)

```php
// bad
$model = Model::orderBy('id');
$count = $model->count(); // counts in db
$model = $model->get();

// good
$model = Model::orderBy('id');
$model = $model->get();
$count = $model->count(); // counts in collection
```

### output console commands (Laravel/Symfony)

```php
// bad
echo $message . PHP_EOL; // with newline in command
echo $message . ' '; // without newline in command
echo str_pad($message, 99, ' ', STR_PAD_RIGHT) . "\r"; // with overwrite in command
(new \Symfony\Component\Console\Output\ConsoleOutput())->writeln($message); // with newline in controller
(new \Symfony\Component\Console\Output\ConsoleOutput())->info($message); // without newline in controller
(new \Symfony\Component\Console\Output\ConsoleOutput())->write(str_pad($message, 99, ' ', STR_PAD_RIGHT) . "\r"); // with overwrite in controller

// good
$this->info($message); // with newline in command
$this->output->write($message); // without newline in command
$this->output->write(str_pad($message, 99, ' ', STR_PAD_RIGHT) . "\r"); // with overwrite in command
ConsoleOutputHelper::info($message); // with newline in controller
ConsoleOutputHelper::write($message); // without newline in controller
ConsoleOutputHelper::overwrite($message); // with overwrite in controller
```

### prevent too much nesting (PHP, JS/TS)

```php
// bad
function log($message): void {
  if(...) {
    echo $message;
  }
}

// good
function log($message): void {
  if(!...) {
    return;
  }
  echo $message;
}
```

### prevent too much nesting — flatten conditionals (PHP, JS/TS)

```php
// bad
if($a === true) {
    if($b === true) {
        if($c === true) {
            return 42;
        }
    }
}
return 7;

// good
if($a !== true) { return 7; }
if($b !== true) { return 7; }
if($c !== true) { return 7; }
return 42;
```

### prevent else (PHP, JS/TS)

```php
// bad
if($foo) {

}
elseif($bar) {

}

// good
if($foo) {

}
if($bar && !$foo) {

}
```

### prevent too much function arguments (PHP)

```php
// bad
foo($value, true, true, false, 42)

// good
foo(value: $value, save: true, cache: true, force: false, amount: 42)
$foo->withSave()->withCache()->withoutForce()->withAmount(42)->calculate($value);
```

### outsource long code parts (PHP, JS/TS)

```php
// bad
$isSpecial = false;
if($foo) { $isSpecial = true; }
if($bar && !$foo) { $isSpecial = false; }
if($isSpecial) {
  //...
}

// good
function isSpecial() {
  if($foo) { return true; }
  if($bar) { return false; }
  return false;
}
if($this->isSpecial()) {
  //...
}
```

### use carbon instead of strings (Laravel)

```php
// bad
date('Y')-10

// good
Carbon::now()->subYears(10)->year
```

### use "final" keyword (PHP)

```php
// bad
class NonDerivativeClass {}

// good
final class NonDerivativeClass {}
```

### use php type hinting (PHP)

```php
// bad
public static function foo($a, $b = null, $c = false) {}

// good
protected function foo(int $a, ?string $b = null, bool $c = false): void {}

// bad
public $foo;

// good
protected ?int $foo;

// bad
public function foo(): void { die(); }

// good
public function foo(): never { die(); }
```

### use jobs to dispatch long running tasks (Laravel)

```php
// bad
longRunningTask();

// good
CalculateLongRunningTaskQueue::dispatch();
```

### single line comments (PHP, JS/TS)

This applies to standalone, sentence-like comments (e.g., migration notices, section headers). For inline code explanations, see `code comments`.

```php
// bad
/* this migration should not run */

// bad
// this migration should not run

// good
// This migration should not run.
```

### multiline comments (PHP, JS/TS)

```php
// bad
// this is
// a multiline
// comment

// bad
/*
this is
a multiline
comment
*/

// good
/**
 * This is
 * a multiline
 * comment.
 */
```

### comment functions (e.g. using copilot) (PHP)

```php
// bad
public function foo(): ?float {}

// good
/**
 * Calculate the value for our example.
 *
 * @return float|null
 */
public function foo(): ?float {}
```

### phpunit tests: the expected value should come first as an argument (PHPUnit)

```php
// bad
$this->assertSame($foo, 'bar');

// good
$this->assertSame('bar', $foo);
```

### always write tests (tdd), use factories (Laravel/PHPUnit)

```php
// good
Model::factory()->count(10)->create(['birth_date' => '1980-01-01']);
Model::factory()->count(10)->create(['birth_date' => '1990-01-01']);
Model::factory()->count(10)->create(['birth_date' => '2000-01-01']);
$this->assertEquals(30, Model::whereBornAfter(1970)->count());
$this->assertEquals(30, Model::whereBornAfter(1980)->count());
$this->assertEquals(20, Model::whereBornAfter(1990)->count());
```

### always catch the most specific exception (PHP)

```php
// bad
catch(\Throwable $e) {
    Log::error($e->getMessage());
}

// good
catch(\PDOException $e) {
    Log::error($e->getMessage());
}
```

### use enums (PHP)

```php
// bad
class Environment
{
    static function get($str) {
        if( $str === 'Entwicklung' ) { return 'dev'; }
        if( $str === 'Test' ) { return 'stage'; }
        if( $str === 'Produktion' ) { return 'prod'; }
    }
}
echo Environment::get('Produktion'); // "prod"

// good
enum Environment: string
{
    case Entwicklung = 'dev';
    case Test = 'stage';
    case Produktion = 'prod';
}
echo Environment::Produktion->value; // "prod"
```

### use progress bars in commands (Laravel)

```php
// bad
$data = getBigDataSet();
foreach($data as $dataValue) {
  /* ... */
}

// good
$data = getBigDataSet();
$this->withProgressBar($data, function ($dataValue) {
  /* ... */
});
```

### extract exceptions (PHP)

```php
// bad
throw new \Exception('Zeitraum ungültig.');

// good
throw ExampleException::invalidDateRange();
// Exceptions/ExampleException.php
<?php
declare(strict_types=1);
namespace App\Exceptions;
use Exception;
class ExampleException extends Exception {
    public static function invalidDateRange(): self {
        return new self('Zeitraum ungültig.');
    }
}
```

### move logic from controller to services (PHP, Laravel)

```php
// bad
class ExampleController {
    public function test(): void {
        $this->fun1();
        $this->fun2();
        $this->fun3();
        $this->fun4();
    }
}

// good
class ExampleController {
    public function __construct(
        private ExampleService1 $exampleService1,
        private ExampleService2 $exampleService2
    ) {}
    public function test(): void {
        $this->exampleService1->fun1();
        $this->exampleService1->fun2();
        $this->exampleService2->fun3();
        $this->exampleService2->fun4();
    }
}
class ExampleService1 {
    public function fun1(): void {}
    public function fun2(): void {}
}
class ExampleService2 {
    public function fun3(): void {}
    public function fun4(): void {}
}
```

### uppercase immutable variables (JS/TS)

Convention only: name class-level static literals/configuration values in `UPPER_SNAKE_CASE` so they read as constants. JS does not enforce immutability — this is purely about readability.

```js
// bad
export default class ExampleClass {
    static foo = 'bar';
}

// good
export default class ExampleClass {
    static FOO = 'bar';
}
```

### extract selectors & split up functions (JS/TS)

```js
// bad
export default class Example {
    load() {
        document.querySelectorAll('.foo').forEach($el => {
            $el.setAttribute('data-href', $el.getAttribute('href'));
            $el.addEventListener('click', e => {
                if (document.querySelector('.bar').value === '') { alert('Falscher Wert.'); }
                $el.setAttribute('href','bar');
            });
        });
    }
}
// good
export default class Example {
    static SELECTOR_1 = '.foo';
    static SELECTOR_2 = '.bar';
    load() {
        this.bindSelectors();
        this.setupExportLinks();
    }
    bindSelectors() {
        this.$selector1 = document.querySelectorAll(Example.SELECTOR_1);
        this.$selector2 = document.querySelector(Example.SELECTOR_2);
    }
    setupExportLinks() {
        this.$selector1.forEach($link => this.setupLink($link));
    }
    setupLink($link) {
        const origUrl = $link.getAttribute('href');
        $link.setAttribute('data-href', origUrl);
        $link.addEventListener('click', e => this.handleClick(e, $link));
    }
    handleClick(e, $link) {
        if (!this.validateDateInputs()) { this.showValidationError(); }
        this.updateUrl($link);
    }
    validateDateInputs() {
        return this.$selector2.value !== '';
    }
    showValidationError() {
        alert('Falscher Wert.');
    }
    updateUrl($link) {
        $link.setAttribute('href','bar');
    }
}
```

### prefix dom elements with dollar sign (JS/TS)

```js
// bad
let el = document.querySelector('.foo');

// good
let $el = document.querySelector('.foo');
```

### move logic (ids/labels) from view to controller (Laravel/Blade)

```php
// bad
return view('example.view');
<ul>
    <li><a href="{{ URL::route('getExample',[1]) }}">Item 1</a></li>
    <li><a href="{{ URL::route('getExample',[2]) }}">Item 2</a></li>
    <li><a href="{{ URL::route('getExample',[3]) }}">Item 3</a></li>
</ul>

// good
private const PARTS = [
    ['id' => 1, 'label' => 'Item 1'],
    ['id' => 2, 'label' => 'Item 2'],
    ['id' => 3, 'label' => 'Item 3']
];
/* ... */
return view('example.view', [
    'parts' => self::PARTS
]);
<ul>
    @foreach($parts as $part)
        <li><a href="{{ URL::route('getExample',[$part['id']]) }}">{{ $part['label'] }}</a></li>
    @endforeach
</ul>
```
