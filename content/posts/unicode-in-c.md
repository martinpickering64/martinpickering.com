---
title: "Unicode in C"
summary: "Given the variety of human languages on this planet, text is a complex subject. Many are scared away from 
dealing with the various scripts of the world. This is because they think of the numerous related software 
problems in the area, instead of focusing on what they can do with their code to help."
date: 2018-05-02T14:07:51Z
draft: true
---
## Encoding text 

Given the variety of human languages on this planet, text is a complex subject. Many are scared away from 
dealing with the various scripts of the world. This is because they think of the numerous related software 
problems in the area, instead of focusing on what they can do with their code to help. 

The first thing to know is that you do not have to worry about most problems with digital 
text. The most difficult work is handled below the application layer, in Operating Systems, UI libraries, 
and the 'C' library. To give you an idea of what goes on though, here is a summary of software 
problems surrounding text: 

### Encoding 

Mapping characters to numbers. Many such mappings exist; once you know the encoding of a piece 
of text, you know what character is meant by a number. Unicode is one such mapping, and a popular 
one since it incorporates more characters than any other (_currently_). 

## Display 

Once you know what character is meant, you must find a font that has the character and render 
it. This task is much complicated by the need to display both left-to-right and right-to-left 
text, the existence of combining characters that modify previous characters and have zero 
width, the fact that some languages require wider character cells than others, and context-sensitive 
letterforms. 

### Input 

An input method is a way to map keystrokes (_most likely several keystrokes on a typical keyboard_) 
to characters. Input is also complicated by bi-directional text. 

### Internationalization [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) 

This refers to the practice of translating a program into multiple languages, effectively 
by translating all the program's strings. 

### Lexicography 

Code that processes text as more than just binary data might have to become a lot smarter. 
The problems of searching, sorting, and modifying letter case (_upper/lower_) vary per language. 
If your application doesn't need to perform such tasks, consider yourself lucky. If you do 
need these operations, you can probably find a UI toolkit or i18n library that already implements them. 

If you are savvy with just the first issue (_encoding_), then OS-vendor-supplied input methods 
and display routines should magically work with your program. Whether you want to or are able 
to translate your software is another matter and compared to proper handling of character encodings 
it is almost optional (_corrupting data is worse than having an unintelligible UI_). 

The encoding this article is about is called Unicode. Unicode officially encodes 1,114,112 characters, 
from `0x000000` to `0x10FFFF`. The idea that Unicode is a 16-bit encoding is completely wrong. For 
maximum compatibility, individual Unicode values are usually passed around as 32-bit integers 
(_4 bytes per character_), even though this is more than necessary. For convenience, the first 
128 Unicode characters are the same as those in the familiar ASCII encoding. 

The consensus is that storing four bytes per character is wasteful, so a variety of representations 
have sprung up for Unicode characters. The most interesting one for 'C' programmers is called 
`UTF-8`. `UTF-8` is a "multi-byte" encoding scheme, meaning that it requires a variable number of 
bytes to represent a single Unicode value. Given a so-called "UTF-8 sequence", you can convert 
it to a Unicode value that refers to a character. 

`UTF-8` has the property that all existing 7-bit ASCII strings are still valid. `UTF-8` only affects 
the meaning of bytes greater than 127, which it uses to represent higher Unicode characters. A 
character might require 1, 2, 3, or 4 bytes of storage depending on its value; more bytes are 
needed as values get larger. To store the full range of possible 32-bit characters, `UTF-8` would 
require a whopping 6 bytes. But again, Unicode only defines characters up to 0x10FFFF, so this 
should never happen in practice. 

`UTF-8` is a specific scheme for mapping a sequence of 1-4 bytes to a number from `0x000000` to `0x10FFFF`:

~~~ 
00000000 -- 0000007F: 0xxxxxxx
00000080 -- 000007FF: 110xxxxx 10xxxxxx  
00000800 -- 0000FFFF: 1110xxxx 10xxxxxx 10xxxxxx  
00010000 -- 001FFFFF: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
~~~

The `x`'s are bits to be extracted from the sequence and glued together to form the final number.
 
It is fair to say that `UTF-8` is taking over the world. It is already used for filenames in Linux 
and is supported by all mainstream web browsers. This is not surprising considering its many nice properties: 

- It can represent all 1,114,112 Unicode characters. 
- Most 'C' code that deals with strings on a byte-by-byte basis still works, since `UTF-8` is fully 
compatible with 7-bit ASCII. 
- Characters usually require fewer than four bytes. 
- String sort order is preserved. In other words, sorting `UTF-8` strings per-byte yields the same 
order as sorting them per-character by logical Unicode value. 
- A missing or corrupt byte in transmission can only affect a single character; you can always
 find the start of the sequence for the next character just by scanning a couple bytes. 
- There are no byte-order/endianness issues, since `UTF-8` data is a byte stream. 

The only price to pay for all this is that there is no longer a one-to-one correspondence 
between bytes and characters in a string. Finding the _nth_ character of a string requires 
iterating over the string from the beginning. 

__Side note__: Some consider `UTF-8` to be discriminatory, since it allows English text to be 
stored efficiently at one byte per character while other world scripts require two bytes 
or more. This is a troublesome point, but it should not get in the way of Unicode adoption. 
First, `UTF-8` was not really designed to preferentially encode English text. It was designed 
to preserve compatibility with the large body of existing code that scans for special 
characters such as line breaks, spaces, `NUL` terminators, and so on. Furthermore, the encoding 
used internally by a program has little impact on the user, if it can represent their data 
without loss. `UTF-8` is a great boon, especially for 'C' programming. Think of it this way: if 
it allows you to internationalize an application that would have been difficult to convert 
otherwise, it is much less discriminatory than the alternative. 

## The C library 

All recent implementations of the standard C library have lots of functions for manipulating 
international strings. Before reading up on them, it helps to know some vocabulary: 

"Multi-byte character" or "multi-byte string" refers to text in one of the many (_possibly language-specific_) 
encodings that exist throughout the world. A multi-byte character does not necessarily require more 
than one byte to store; the term is merely intended to be broad enough to encompass encodings where 
this is the case. `UTF-8` is in fact only one such encoding; the actual encoding of user input is 
determined by the user's current locale setting (_selected as an option in a system dialog or stored 
as an environment variable in UNIX_). Strings you get from the user will be in this encoding, and 
strings you pass to `printf()` are supposed to be as well. Strings within your program can of course 
be in any encoding you want, but you might have to convert them for proper display. 

"Wide character" or "wide character string" refers to text where each character is the same size 
(_usually a 32-bit integer_) and simply represents a Unicode character value (_code point_). This 
format is a known common currency that allows you to get at character values if you want to. The 
`wprintf()` family is able to work with wide character format strings, and the `%ls` format 
specifier for normal `printf()` will print wide character strings (_converting them to the correct 
locale-specific multi-byte encoding on the way out_). 

The 'C' library also provides functions like `towupper()` that can convert a wide character from 
any language to uppercase (_if applicable_). `strftime()` can format a date and time string 
appropriately for the current locale, and `strcoll()` can do international sorting. These 
and other functions that depend on locale must be initialized at the beginning of your
program using 

~~~
#include <locale.h> 
 
int main() 
{ 
    char *locale; 
 
    locale = setlocale(LC_ALL, ""); 
    ... 
} 
~~~

You don't have to do anything with the locale string returned by `setlocale()`, but you can 
use it to query your user's locale settings (_more on this later_). 

The 'C' library pretty much assumes you will be using multi-byte strings throughout 
your program (_since that's what you get as input_). Since multi-byte strings are opaque, 
a lot of functions beginning with 'mb' are provided to deal with them. Personally, 
I don't like remaining ignorant of what encoding my strings use. One concrete problem 
with the multi-byte thing is file I/O; a given file could be in any encoding, independent 
of locale. When you write a file or send data over a network, keeping the multi-byte encoding 
might be a bad idea. Even if all software uses only the proper locale-independent 'C' library 
functions, and all platforms support all encodings internally, there is still no single 
standard for communicating the encoding of a piece of text; e.g. email messages and HTML tags 
do it in various ways. You also might be able to do more efficient processing, or avoid 
rewriting code, if you knew the encoding your strings used. 

### Your encoding options 

You are free to choose a string encoding for internal use in your program. The choice 
pretty much boils down to either `UTF-8`, wide (_4-byte_) characters, or multi-byte. Each 
has its advantages and disadvantages: 

UTF-8 

- Pro: compatible with all existing strings and most existing code 
- Pro: takes less space 
- Pro: widely used as an interchange format (_e.g. in XML_) 
- Con: more complex processing, `O(n)` string indexing 

Wide characters 

- Pro: easy to process 
- Con: wastes space 
- Pro/Con: although you can use the syntax `L"Hello, world."` to easily include wide-character 
strings in 'C' programs, the size of wide characters is not consistent across platforms 
(_some incorrectly use 2-byte wide characters_) 
- Con: should not be used for output, since spurious zero bytes and other 
low-ASCII characters with common meanings (_such as `/` and `\n`_) will likely be 
sprinkled throughout the data. 

Multi-byte 

- Pro: no conversions ever needed on input and output 
- Pro: built-in C library support 
- Pro: provides the widest possible internationalization, since in rare cases 
conversion between local encodings and Unicode does not work well 
- Con: strings are opaque 
- Con: perpetuates incompatibilities. For example, there are three major 
encodings for Russian. If one Russian sends data to another through your 
program, the recipient will not be able to read the message if his or her 
computer is configured for a different Russian encoding. But if your program 
always converts to `UTF-8`, the text is effectively normalized so that it will 
be widely legible (_especially in the future_) no matter what encoding it started in. 

I advocate explicit instruction on using `UTF-8` as an 
internal string encoding. Many Linux users already set their environment to a `UTF-8` 
locale, in which case you won't even have to do any conversions. Otherwise you will 
have to convert multi-byte to wide to `UTF-8` on input, and back to multi-byte on 
output. Nevertheless, `UTF-8` has its advantages.

## What to do right now 

Below I outline concrete steps any 'C' programmer could take to bring their code up to 
date with respect to text encoding. I also present a simple C library that provides the 
routines needed to manipulate `UTF-8`. 

Here's the to-do list: 

### "char" no longer means character 

I recommend referring to character codes in C programs using a 32-bit unsigned integer 
type. Many platforms provide a `wchar_t` (_wide character_) type, but unfortunately it is 
to be avoided since some compilers allot `wchar_t` only 16-bits; not enough to represent Unicode. 
Wherever it is needed to pass around an individual character, change `char` to `unsigned 
int` or similar. The only remaining use for the `char` type is to mean `byte`. 

### Get UTF-8-clean 

To take advantage of `UTF-8`, treat bytes higher than 127 as perfectly ordinary characters. 
For example, a routine that recognizes valid identifier names for a programming language. The 
existing technique might involve identifiers begining with a letter: 

~~~
int valid_identifier_start(char ch) 
{ 
    return ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')); 
} 
~~~

Using `UTF-8`, letters from other languages are allowed for as follows: 

~~~
int valid_identifier_start(char ch) 
{ 
    return ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || 
            ((unsigned char)ch >= 0xC0)); 
} 
~~~

A `UTF-8` sequence can only start with values `0xC0` or greater, so that's what is 
used for checking the start of an identifier. Within an identifier, also allow 
characters `>= 0x80`, which is the range of `UTF-8` continuation bytes. 

Most 'C' string library routines still work with `UTF-8`, since they only scan for 
terminating `NUL` characters. A notable exception is `strchr()`, which in this context is 
more aptly named `strbyte()`. Since character codes are passed around as 32-bit integers, 
replace this with a routine such as `u8_strchr()` that can scan `UTF-8` for a given character. 
The traditional `strchr()` returns a pointer to the location of the found character, 
and`u8_strchr()` follows suit. In order to obtain the index of the found character, 
and since `u8_strchr()` has to scan through the string anyway, it keeps a count and 
returns a character index as well. 

With the old `strchr()`,pointer arithmetic could be used to determine the character index. Now, 
any use of pointer arithmetic on strings is likely to be broken since characters are no 
longer bytes. Any such code will need to be found and fix any code that assumes `(char*)b - (char*)a` 
is the number of characters between `a` and `b` (though it is still of course the number of bytes 
between `a` and `b`_). 

### Interface with the environment 

Using `UTF-8` as an internal encoding is now widespread among 'C' programmers. However, 
the environment the program runs in will not necessarily be nice enough to feed 
it `UTF-8` or expect `UTF-8` output. 

The functions `mbstowcs()` and `wcstombs()` convert from and to locale-specific encodings,
 respectively. `mbs` means multi-byte string (_i.e. the locale-specific string_), and `wcs` means 
wide character string (_universal 4-byte characters_). Clearly, if wide characters are used internally, 
job done. If `UTF-8` is used, there is a chance that the user's locale will be set to `UTF-8` and 
no conversions are required. To take advantage of that situation, detect it (_a function is provided to do this_). 
Otherwise, convert from multi-byte to wide to `UTF-8`.
 
Version 1.6 (_1.5.x while in development_) of the FOX toolkit uses `UTF-8` internally, giving 
dependent programs a nice _all-UTF-8-all-the-time environment_. GTK2 and Qt also support `UTF-8`. 

### Modify APIs to discourage `O(n^2)` string processing 

The idea of non-constant-time string indexing may be a worry. But the reality is there 
is rarely a need to specifically access the _nth_ character of a string. Algorithms almost 
never need to make requests like "Quick! Get me the 6th character of this piece of text!" Typically, 
accessing characters whilst iterating over the whole string, or most of it, `UTF-8` 
is simple enough to process the iteration over the characters and takes essentially the same 
time as iterating over bytes. 

Use `u8_inc()` and `u8_dec()` to move through strings. In any libraries developed, be sure 
to expose some kind of `inc()` and `dec()` API so nobody has to move through a string 
by repeatedly requesting the _nth_ character. 

## Some `UTF-8` routines 

Various libraries are available for internationalization and converting between different 
text encodings. However, there does not appear to be a straightforward set of 'C' routines 
providing the minimal support needed for using `UTF-8` as an internal encoding 
(_although this functionality is often embedded in large UI toolkits_). I decided to create 
a small library that could be used to bring `UTF-8` to arbitrary 'C' programs. 
This library is quite incomplete; and we might want to look at related FSF offerings and libutf8. 
libutf8 provides the multi-byte and wide character 'C' library routines mentioned above, 
should this support not be available. 

Since performance is sometimes a concern with `UTF-8`, the routines as fast and lightweight. 
They perform minimal error checking; they do not bother to determine whether a sequence is 
valid `UTF-8`, which can be a security problem. The justification is that the intention of 
the library is to manipulate an internal encoding; enforcement that all strings stored in 
memory be valid `UTF-8` is an external [_to the library_] concern. Routines for validating 
and converting from/to `UTF-8` are available, for example from Unicode, Inc. 

Note that the library routines do not need to support the many encodings of the world; 
the 'C' library can handle that. If the current locale is not `UTF-8`, call `mbstowcs()` on 
user input to convert any encoding (_whatever it is_) to a wide character string, then 
use `u8_toutf8()` to convert it to the `UTF-8`. Here's an example input routine wrapping `readline()`:

~~~ 
char *get_utf8_input() 
{ 
    char *line, *u8s; 
    unsigned int *wcs; 
    int len; 
 
    line = readline(""); 
    if (locale_is_utf8) { 
        return line; 
    } 
    else { 
        len = mbstowcs(NULL, line, 0)+1; 
        wcs = malloc(len * sizeof(int)); 
        mbstowcs(wcs, line, len); 
        u8s = malloc(len * sizeof(int)); 
        u8_toutf8(u8s, len*sizeof(int), wcs, len); 
        free(line); 
        free(wcs); 
        return u8s; 
    } 
~~~

The first call to `mbstowcs()` uses the special parameter value `NULL` to find the number of 
characters in the opaque multi-byte string. 

The routines are divided into four groups: 
### Group 1: conversions 

~~~
/* is c the start of a utf8 sequence? */ 
#define isutf(c) (((c)&0xC0)!=0x80) 
 
/* convert UTF-8 to UCS-4 (4-byte wide characters) 
   srcsz = source size in bytes, or -1 if 0-terminated 
   sz = dest size in # of wide characters 
   returns # characters converted */ 
int u8_toucs(unsigned int *dest, int sz, char *src, int srcsz); 
 
/* convert UCS-4 to UTF-8 
   srcsz = number of source characters, or -1 if 0-terminated 
   sz = size of dest buffer in bytes 
   returns # characters converted */ 
int u8_toutf8(char *dest, int sz, unsigned int *src, int srcsz); 
 
/* single character to UTF-8 */ 
int u8_wc_toutf8(char *dest, wchar_t ch); 
~~~

Note that the library uses `unsigned int` as its wide character type. 

It is possible to convert a known number of bytes, or a `NUL`-terminated string. The length 
of a `UTF-8` string is often communicated as a byte count, since that's what 
really matters. Recall that a `UTF-8` string can usually be treated like a normal 
C-string with N characters (_where N is the number of bytes in the UTF-8 sequence_), 
with the possibility that some characters are > 127. 

### Group 2: moving through UTF-8 strings 

~~~
/* character number to byte offset */ 
int u8_offset(char *str, int charnum); 
 
/* byte offset to character number */ 
int u8_charnum(char *s, int offset); 
 
/* return next character, updating a byte-index variable */ 
unsigned int u8_nextchar(char *s, int *i); 
 
/* move to next character */ 
void u8_inc(char *s, int *i); 
 
/* move to previous character */ 
void u8_dec(char *s, int *i); 
~~~

### Group 3: Unicode escape sequences 

In the absence of Unicode input methods, Unicode characters are often notated 
using special escape sequences beginning with`\u` or `\U`. `\u` expects up to four 
hexadecimal digits, and `\U` expects up to eight. With these routines a program can 
accept input and give output using such sequences if necessary. 

~~~
/* assuming src points to the character after a backslash, read an 
   escape sequence, storing the result in dest and returning the number of 
   input characters processed */ 
int u8_read_escape_sequence(char *src, unsigned int *dest); 
 
/* given a wide character, convert it to an ASCII escape sequence stored in 
   buf, where buf is "sz" bytes. returns the number of characters output. */ 
int u8_escape_wchar(char *buf, int sz, unsigned int ch); 
 
/* convert a string "src" containing escape sequences to UTF-8 */ 
int u8_unescape(char *buf, int sz, char *src); 
 
/* convert UTF-8 "src" to ASCII with escape sequences. 
   if escape_quotes is nonzero, quote characters will be preceded by 
   backslashes as well. */ 
int u8_escape(char *buf, int sz, char *src, int escape_quotes); 
 
/* utility predicates used by the above */ 
int octal_digit(char c); 
int hex_digit(char c); 
~~~

### Group 4: replacements for standard functions 

~~~
/* return a pointer to the first occurrence of ch in s, or NULL if not 
   found. character index of found character returned in *charn. */ 
char *u8_strchr(char *s, unsigned int ch, int *charn); 
 
/* same as the above, but searches a buffer of a given size instead of 
   a NUL-terminated string. */ 
char *u8_memchr(char *s, unsigned int ch, size_t sz, int *charn); 
 
/* count the number of characters in a UTF-8 string */ 
int u8_strlen(char *s); 
 
/* given the string returned by setlocale(), determine whether the current 
   locale speaks UTF-8 */ 
int u8_is_locale_utf8(char *locale); 
 
/* these functions can print from UTF-8 strings. they make no assumptions 
   about locale; you can circumvent them if is_locale_utf8 */ 
int u8_vprintf(char *fmt, va_list ap); 
int u8_printf(char *fmt, ...); 
~~~