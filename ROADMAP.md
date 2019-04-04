# Roadmap

This document contains a rough outline of future features and changes in Prisma. Its primary purpose is to provide visibility into the current efforts of the Prisma engineering team and make Prisma users aware of upcoming changes.

The roadmap is updated every two weeks (i.e. with every Prisma release). If you want to see the changes that have happened in the latest releases, check out the [changelog](https://github.com/prisma/prisma/releases).

## Q1/Q2 2019

### Short term fixes & improvements

The following lists represent a number of smaller-scope issues and improvements that we are currently working on. While we're trying to be as accurate as possible, our priorities might shift and the list may be adjusted in a future release cycle.

#### Improvements

- [ ] [Nested upsert in create mutations (correct: nested connectOrCreate) #2194](https://github.com/prisma/prisma/issues/2194)
- [ ] [Use sensible migration values for existing nodes when adding required fields #2323](https://github.com/prisma/prisma/issues/2323)
- [ ] [Allow for custom IDs to be submitted in a create-mutation #3839](https://github.com/prisma/prisma/issues/3839)
- [ ] [[Mongo] improve relational link design to enhance performance #3754](https://github.com/prisma/prisma/issues/3754)
- [ ] [Add inner connection fields #1780](https://github.com/prisma/prisma/issues/1780)
- [ ] [Order by multiple fields #62](https://github.com/prisma/prisma/issues/62)

#### Bug fixes

- [ ] [Export import fails #3183](https://github.com/prisma/prisma/issues/3183)
- [ ] [Introspect postgres: "Could not connect to database. Prisma Config doesn't have any database connection" #3136](https://github.com/prisma/prisma/issues/3136)

### Specification phase

The "specification phase" reflects the spec work we do before starting to actually implement a feature. All important features are being specced out and discussed on GitHub. Please join the discussions and share your opinions with us.

Here are the big features that are currently being specced out:

- [A more fine-grained and powerful migration system](https://github.com/prisma/rfcs/blob/migrations/text/0000-migrations.md)
- [An aggregations API](https://github.com/prisma/rfcs/blob/prisma-basic-aggregation-support/text/0000-prisma-basic-aggregation-support.md)
- [A more powerful API for the Prisma client](https://github.com/prisma/rfcs/blob/prisma-basic-aggregation-support/text/0000-prisma-basic-aggregation-support.md)
- [A new generator API for the Prisma client](https://github.com/prisma/rfcs/blob/client-generators/text/0000-client-generators.md)

### Implementation phase

The "implementation phase" reflects the larger features that we are currently working on. These features typically require multiple weeks/months to be implemented:

- [Prisma Admin](https://github.com/prisma/prisma-admin-feedback)
- [Datamodel v1.1](https://github.com/prisma/prisma/issues/3408)
- [Enabling usage of the Prisma client without running an extra server](https://github.com/prisma/prisma/issues/2992)
- A reimplementation of the Prisma core in Rust

## Upcoming

While the following features are currently not listed in the `Q1/Q2 2019`-section, they may still get added to it:

- Datamodel v2
- Prisma SDK
- Observability & monitoring
- Caching
- Subscriptions & clustering
- Query analytics
