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

* Route for receiving model, and sending back model after FBA
    * store base model, as well as 'experiments'
    * experiments will store:
        * the framework which was used to achieve results
        * list of gene insertion/deletions, (reactions)
        * for each reaction, the flux
* compute 'flux deltas' for every experiment used with a specific model
* quee Python child processes, or find a better way to manage child processes. consider porting to a python based serverside framework such as Flask. how does Flask handle routes that will take on the order of minutes? Perhaps implement a job system.
* Users? to store and retrieve your 'experiments'

### Community Flux Balance Analysis Pipeline

* Models have varying names for metabolites, or sometimes none and only the id. Develop a pipeline for creating and maintaining a standardized set of metabolites and reactions to be used across all models. Integrate this with a web application to increase cooperation and standardization
* cFBA framework
    * Given a list of `n` species and their respective genome scale metabolic models (following SBML format as either originally an `.xml` or later as a `.json`),
    * Develop a list of all reactions across all species that occur in the extracellular space, or `e`
    * For each species `i` in `n`, loop through every reaction in `e`. If a reaction contains a metabolite that is involved in a reaction from the 'global e reactions', append it into the model of that specie. This should take O(*rxns_e* \* *n*) where *rxns_e* is the maximal number of extracellular reactions in a specie, and *n* is the number of species.
    * Perform FBA individual on each species `i` in `n`, optimizing for biomass production. The time this takes is proportional to the size of the linear problem to be solved. Further time analysis is necessary to accurately provide an upper bound on this process.
    * Using the results of FBA on each species, we have gathered a flux for each reaction in *rxns_e* of that specie. This will be different across the species; set a new upper and lower bound for each of this reactions by taking the average - SD and the average + SD. In this way, for all of the reactions which share extracellular metabolites, after this point, they will have the same lower and upper bounds.
    * Perform FBA on each species again. Optimizing for biomass, as before. Again, more structured time analysis is needed, however this should take similar time to the previous step.
    * Each biomass objective function for each species returns a numeric value. Use z-scoring to standardize these distributions, so that we may compute a 'relative biomass' value for each specie. The sum of all these values must be equal to 1.
    * Construct a single metabolic model representing the entire community. Each species will be assigned a 'compartment'. The upper and lower bounds of each reaction in each specie will be modified as per that specie's relative biomass. In this way, reactions belonging to a less important specie will have less effect (or more) on the optimization of the objective function, which will be biomass. The results of this cFBA analysis should coincide (to a degree) with experimentally observed community dynamics.


## License
MIT License
