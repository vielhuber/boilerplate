---
applyTo: '**'
---

- Always answer in German and with a robot emoji 🤖 at the end.
- Write comments always in english.

### code comments

```php
// bad
// Dies ist ein Kommentar auf Deutsch

// bad
// This Is A Comment

// good
// this is a comment
```

### prevent stfu operator

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

### prevent static classes

```php
// bad
Example::calculate($obj)

// good
(new Example($obj))->calculate()
```

### prevent static arguments

```php
// bad
public static int $foo;

// good
public int $foo;
```

### loop namings

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

### prevent abbreviations

```php
// bad
$model->calc()

// good
$model->calculate()
```

### cases

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

### prevent arrays

```php
// bad
exampleFunction(['foo' => 'bar', 'bar' => 'baz'])

// good
exampleFunction(foo: 'bar', bar: 'baz')
```

### prevent arrays (2)

```php
// bad
$foo = (object) ['foo' => 'bar', 'bar' => 'baz']; // anonymous object with properties 'foo' and 'bar'

// good
$foo = (new Foo())->foo('bar')->bar('baz')->get(); // Foo object with properties 'foo' and 'bar'
```

### use classes / use getters / prevent arrays

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

### prevent monster classes / outsource in separate classes

```php
// bad
$objectInBigModel->calculateSpecialValue();


// good
(new SpecialValueCalculator($objectInBigModel))->calculate()
```

### use dtos

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

### use vos

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
  public static fromInteger(int $value): self {
    return self($value);
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

### use constants

```php
// bad
$threshold = 42;
$anther_val = $threshold + 7;

// good
class ExampleModel {
    public const THRESHOLD_VALUE = 40;
}
$another_val = ExampleModel::THRESHOLD_VALUE + 7;
```

### function chaining

```php
// bad
$value = $foo->calc(save: true);

// good
$foo->save()->calc()->getValue();

// bad
(new Foo(data: 'bar'))->calc()

// good
(new Foo())->setData(data: 'bar')->calc()
```

### use framework functions

```php
// bad
$str = trim($str);
$str = mb_strtoupper($str);
$str = str_replace(' ', '', $str);

// good
$str = Str::of($str)->trim()->upper()->replace(' ', '')->toString();

// bad
$num = number_format($num, ',', '.', 4)

// good
$num = Number::format($num, precision: 4, locale: 'de')
```

### prevent duplicate database calls

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

### output console commands

```php
// bad
echo $msg . PHP_EOL; // with newline in command
echo $msg . ' '; // without newline in command
echo str_pad($msg, 99, ' ', STR_PAD_RIGHT) . "\r"; // with overwrite in command
(new \Symfony\Component\Console\Output\ConsoleOutput())->writeln($msg); // with newline in controller
(new \Symfony\Component\Console\Output\ConsoleOutput())->info($msg); // without newline in controller
(new \Symfony\Component\Console\Output\ConsoleOutput())->write(str_pad($msg, 99, ' ', STR_PAD_RIGHT) . "\r"); // with overwrite in controller

// good
$this->info($msg); // with newline in command
$this->output->write($msg); // without newline in command
$this->output->write(str_pad($msg, 99, ' ', STR_PAD_RIGHT) . "\r"); // with overwrite in command
ConsoleOutputHelper::info($msg); // with newline in controller
ConsoleOutputHelper::write($msg); // without newline in controller
ConsoleOutputHelper::overwrite($msg); // with overwrite in controller
```

### prevent too much nesting

```php
// bad
function log($msg) : void {
  if(...) {
    echo $msg;
  }
}

// good
function log($msg) {
  if(!...) {
    return;
  }
  echo $msg;
}
```

### prevent too much nesting (2)

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

### prevent else

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

### prevent too much function calls

```php
// bad
foo($value, true, true, false, 42)

// good
foo(value: $value, save: true, cache: true, force: false, amount: 42)
$foo->withSave()->withCache()->withoutForce()->withAmount(42)->calculate($value);
```

### outsource long code parts

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

### use carbon instead of strings

```php
// bad
date('Y')-10

// good
Carbon::now()->subYears(10)->year
```

### use "final" keyword

```php
// bad
class NonDerivativeClass {}

// good
final class NonDerivativeClass {}
```

### use php type hinting

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

### use jobs to dispatch long running tasks

```php
// bad
longRunningTask();

// good
CalculateLongRunningTaskQueue::dispatch();
```

### single line comments

```php
// bad
/* this migration should not run */

// bad
// this migration should not run

// good
// This migration should not run.
```

### multiline comments

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

### comment functions (e.g. using copilot)

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

### phpunit tests: the expected value should come first as an argument

```php
// bad
$this->assertSame($foo, 'bar');

// good
$this->assertSame('bar', $foo);
```

### always write tests (tdd), use factories

```php
// good
Model::factory()->count(10)->create(['birth_date' => '1980-01-01']);
Model::factory()->count(10)->create(['birth_date' => '1990-01-01']);
Model::factory()->count(10)->create(['birth_date' => '2000-01-01']);
$this->assertEquals(30, Model::whereBornAfter(1970)->count());
$this->assertEquals(30, Model::whereBornAfter(1980)->count());
$this->assertEquals(20, Model::whereBornAfter(1990)->count());
```

### always catch the most specific exception

```php
// bad
catch(\Throwable $e) {
    print_r($e->getMessage());
}

// good
catch(\PDOException $e) {
    print_r($e->getMessage());
}
```

### use enums

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

### use progress bars in commands

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

### extract exceptions

```php
// bad
throw new\Exception('Zeitraum ungültig.');

// good
throw ExampleException::partNotFound();
// Exceptions/ExampleException.php
namespace App\Exceptions;
use Exception;
class StudbookException extends Exception {
    public static function invalidDateRange(): self {
        return new self('Zeitraum ungültig.');
    }
}
```

### move logic from controller to services

```php
// bad
class ExampleController {
    test() {
        $this->fun1();
        $this->fun2();
        $this->fun3();
        $this->fun4();
    }
}

// good
class ExampleController {
    public function __construct(ExampleService1 $exampleService1, ExampleService2 $exampleService2)
    {
        $this->exampleService1 = $exampleService1;
        $this->exampleService2 = $exampleService2;
    }
    test() {
        $this->exampleService1->fun1();
        $this->exampleService1->fun2();
        $this->exampleService2->fun3();
        $this->exampleService2->fun4();
    }
}
class ExampleService1 {
    fun1() {}
    fun2() {}
}
class ExampleService2 {
    fun3() {}
    fun4() {}
}
```

### uppercase immutable variables

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

### extract selectors & split up functions

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

export default class Example {
    static SELECTOR_1 = '.foo';
    static SELECTOR_2 = '.bar';
    load() {
        this.bindSelectors();
        this.setupExportLinks();
    }
    bindSelectors() {
        this.$selector1 = document.querySelectorAll(getStudbook.DATE_SELECTORS.BEGIN);
        this.$selector2 = document.querySelector(getStudbook.DATE_SELECTORS.END);
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
        if (!this.validateDateInputs()) { $this.showValidationError(); }
        this.updateExportUrl($link);
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

### prefix dom elements with dollar sign

```js
// bad
let el = document.querySelector('.foo');

// good
let $el = document.querySelector('.foo');
```

### move logic (ids/labels) from view to controller

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
    ['id' => 2, 'label' => 'Item 2']
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
