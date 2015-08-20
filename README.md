![logo](http://45.55.193.224/logo_grey.png)

# MetaFlux

MetaFlux is a we-based tool for

* visualizing
* interacting
* creating
* comparing

**genome scale metabolic models of microbial consortia**.

## What is iGEM?

University of Toronto iGEM (international Genetically Engineered Machine) is a
student association dedicated to the practice of synthetic biology and
dissemination of its scientific foundations. The culmination of each year's
efforts is a submission to the iGEM conferences as the University of Toronto
team.

## Usage

Straightforward drag and drop UI, ability to add species, and analazye
their reactions and metabolites, along side calculating their flux.

## Technologies Used

| Name    | Reference              | Version |
|:--------|:-----------------------|:--------|
| Node    | https://nodejs.org/    | 0.12.6  |
| Angular | https://angularjs.org/ | 1.4.2   |
| Bower   | http://bower.io/       | 1.4.1   |
| D3      | http://d3js.org        | 3.5.5   |


## Installation

To be able to use our web app, you must have [NodeJS](https://nodejs.org/) and
the latest version of `npm`. Following code assumes a Debian based OS.

```bash
$ sudo npm install -g bower
$ git clone https://github.com/igemuoftATG/fba-webapp
$ cd fba-webapp
$ npm install
$ bower install
$ gulp
```

## Changelog

### 1.0.0

* Renders metabolic network as a set of *nodes* and *links*
* Integration of d3 with custom canvas rendering for improved performance
* Basic dragging of nodes working
* Panning and zooming of canvas working

## ToDos

As these items are completed, add them to the changelog with the appropriate
version. Each task completion warrants a *micro* versioning.
(`major.minor.micro`). When a set of tasks warrants a feature completion, that will warrant a *minor* versioning. Major versioning changes will only occur under the condition that the API has change, that is, `2.0.0` implies that API calls from `1.X.X` may be deprecated and no longer guaranteed to work.

### Front-End

* Add node
    * A `node` can either be a `Metabolite` or a `Reaction`
    * If metabolite, can either be alone, as a substrate, or as a product
    * If reaction, requires at least one substrate or one reaction, can have both
    * Ability to fill in all properties so that it can be stored as a valid COBRApy `Metabolite` or `Reaction` in JSON format
* Delete node
    * Should visually hide node while keeping track that it is hidden
    * Prepare a *model*, that is, the object representing the array of `Metabolite`'s and `Reaction`'s without the node, to be sent off the back-end for FBA
* Add/Delete `Reaction`
    * See above. Must follow COBRApy standards.
* Subspace partitioning
    * May either use forces within forces, group of nodes acting as one node, etc
    * Need to visually seperate compartments such as cytosol (`c`), periplasm (`p`) and extracellular (`e`)
    * Furthermore, individual species need to seperated in the same manneru
    * Include ability to hide inner subspaces (for example, hide intracellular when doing a community view)


### Back-end

### Community Flux Balance Analysis Pipeline

## License
MIT License
