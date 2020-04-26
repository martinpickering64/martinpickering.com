---
title: "National Language Support Definitions"
date: 2018-02-05T10:49:19Z
draft: false
summary: "An attempt at defining the terms Character Set, Encoding, Locale and National Language Support."
categories: Software
tags: ["i8n"]

---
# Character Set
* Is a collection or list of characters
* Any given character set contains the characters needed to support a specific language (_or languages_)
* Character Sets are often given names

For example:

> The Latin Character Set is used by English and most Western European languages, 
> though the Greek Character Set is used only by the Greek language.

# Code Point
* The characters of a Character Set are represented by numbers​
* A Code Point is any one of the numbers used to represent a valid character of the Character Set​
* The set of Code Points that represent all of the characters of a Character Set is a Code Point collection​
* A Code Point collection has a name, e.g. ASCII, Unicode, Windows-1252​

For example:​

>The letter 'A' might be represented by the number 1 and the letter 'Z' by 26, 
 therefore the range 1 through 26 are the Code Points for letters 'A' through 'Z'.​

# Code Unit
* Is a sequence of bits used to represent a given Code Point​

For example:​

> Representing our A-Z Character Set with Code Points 1 through 26 
and using a sequence of 5-bits for each Code Point obtains Code Units such as:​<br>
 `00001 == 1 == A​`<br>
 `00011 == 3 == C​`<br>
 `11010 == 26 == Z`

# Encoding
* Is the method used to map between a Code Point and its respective Code Unit​
* Encodings are given names​
* Confusingly some Encoding names are the same/similar to the name of a Character Set, e.g. ASCII and ASCII-7​
* Even more confusingly many Encodings are commonly referred to as Character Sets, e.g. UTF-8​
* Most confusing of all, some names represent a Character Set, a Code Point collection 
  and an Encoding, e.g. ISO-8859-1 (Latin Western European, single byte encoding)​

# Locale
* A Locale is a set of parameters defining the User's language, region and any 
  particular preferences that the User wants to see in their user interface​
* Locales are given a name, e.g. en, en-GB , cy-GB​

Affects​
* Character set and orientation (left-to-right)​
* Date-time representation and time zone selection​
* Formatting of numbers and currency​

> Note: _can affect the active NLS settings used by an Oracle​ Data Server/Database_

# National Language Support
* National Language Support (NLS) is part of Oracle​ Data Server
* NLS allows storage, processing and retrieval of data in native languages​
* NLS ensures that database utilities and error messages, sort order, date, 
  time, monetary, numeric, and calendar conventions automatically adapt to the native language and locale​
* NLS settings on the Client and the Server can differ and Oracle will convert between the two​

# ASCII
* ASCII is 128 characters including: A through Z, a through z, 0-9, punctuation and certain special characters​
* The Code Point collection for ASCII uses numbers ranging from 0 to 127​
* The characters are arranged such that the "English" sort order of characters 
  (_ASCII-betical_) is preserved in its numerical sequence, e.g. A (65), B(66), C(67)​
* The ASCII-7 Encoding uses a 8-bit sequence for each Code Point where the binary value is equivalent to the Code Point value​

For example:​

> `A == Code Point 65 == 0100 0001​`

# ISO-8859
* ISO-8859 is both an Encoding, a set of Code Point specifications and 15 character sets (covering Latin-based languages)​
* The encoding is an 8-bit sequence using all 256 possible values, i.e. every Code Point is represented by a byte​
* All Code Point collections have the same 1st 128 characters and they are equivalent to ASCII​
* The next (higher-order) 128 characters represent additional characters​
* There are 15 different sets of these higher order 128 characters, ISO-8859-1 thro' ISO-8859-11 and ISO-8859-13 thro' ISO-8859-15​
* The ISO-8859 Standard is no longer being maintained/developed​

# ISO-8859-1
* This is the Character Set, Code Point collection and Encoding method that many 'C' applications used to use
* It consists of 191 characters from the Latin script. ​
* It is used throughout the Americas, Western Europe, Oceania, and much of Africa​
* It is commonly used in most "romanizations" of East-Asian languages​
* Forms the basis for popular Code Point collections, including Windows-1252 and the first block in Unicode​

# UTF-8
* Is an Encoding scheme for the Unicode Character Set/Code Point collection​
* It uses between 1 and 4 bytes to represent each Code Point​
* It is backwards compatible with ASCII-7​
* More than 90% of all Web Pages can be said to be UTF-8 (_probably because they are boring, old, generic English text entirely represented in ASCII?​_)
* UTF-8 is the default encoding for XML

# UTF-8 Encoding

{{< figure src="utf-8-encoding.png" >}}

# An Encoding Example
An example of UTF-8 Encoding for the Letter A:

* Unicode character `UPPERCASE A` has a Code Point of `65` (`0x41`)​
* As that falls in the range of `0x00` thro' `0x7F`, 1 byte is needed to store the encoding​
* Therefore, `A == 0x41 == 0010 0001​`

 An example of UTF-8 Encoding for the Letter &#xE4;:​

* Unicode character `LATIN SMALL LETTER A WITH DIAERESIS` &#xE4; has a Code Point of `228` (`0x00E4`)​
* As that falls in the range of `0x0080` thro' `0x07FF`, 2 bytes are needed to store the encoding​
* Therefore, &#xE4; == 0xC3A4 == 1100 0011 1010 0100