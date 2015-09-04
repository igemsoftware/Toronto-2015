## Notes from Sep. 3 Meeting

* inputs -> outputs, diagram for 'interactions' slide
* storyline
* integration with project
* integration with wetlab
* chart
* edit and display mode
* selectively show certain nodes/reactions
* optimize button
* compartmentalized
* *why* we are doing FBA
* more marketing
* presentation team -> **Sep. 11 presentation**
* twist -> sell
* the reason to use it
* nothing stands out
* tags -> diagram
* easy to use, understand, pretty UI
* focus on FBA
* **problem, hypothesis, solution, results**
* the state of science
* current methods and their limitations (us vs. Kbase narratives vs. others)
* rapid advances
* ahhhhhhhhhhhh
* highthroughput sequeuncing is recent, needs methods to analyze (no web
  software for this)
* transition into application for bioremediation with wet lab
* our modeling -> influenced tod-E for wet lab
* recent advances
* transition into P&P

### General presentation structure

*note: presentation is 20mins, with time for questions afterwards. We can use
*question time sneak in more details that are not included in the presentation.
*The judges will use our wiki to found out more, so the presentation should be
*snappy, effective, and leave you wanting more (FBA)*

1. Problem statement
    * why their needs to be this tool vs. old which was "bioremediation of tailings ponds" (but don't worry, we'll get to that)
2. Introduction to FBA, MetaFlux
    * should explain what FBA does, not how (ref. our wiki for how)
    * quickly go through the points about MetaFlux with regards to meeting the medal requirements. Be clear and concise.
    * Quick MetaFlux video demo
3. Transition into the application of our tool with regards to our wet lab team. We found bioremediation of tailings ponds to be a problem that requires solving, but were not entirely convinced the introduction of a gene which codes for an enzyme that will breakdown a harmful metabolite (toluene). This is because community structure and interaction is largely the primary factor to achieve bioremediation. Soooo with the use of our tool, we added the tod-E gene into an *E. Coli K12* model, and performed community flux balance analysis using our in house pipeline similar to the methods employed by Stolyar, Van Dien, et. al. in *Metabolic modelling of a mutualistic microbial community*. The results indicated, that compared to the WT *E. Coli*, toluene degredation was active, and **the community biomass objective function produced a larger value** (i.e., the community survived better)
4. Thus, we embarked upon the long and arduous task of doing wet lab stuff.
5. And then we also did some P&P stuff to support that.

### The State of MetaFlux

We have:

* display of SBML -> Cobrapy formatted models working in browsers using `D3.js` to set the `x,y` (and other) values for each metabolite and reaction, and these nodes are rendered using HTML5 canvas
* this visualization is interactive, having:
    * panning
    * zooming
    * node dragging
* furthermore, other interactive elements present within the visualization and sidebar have effects which modify the underlying metabolic model:
    * metabolite insertion/deletion
    * reaction insertion/deletion
    * **the ability to add genes from the standard parts database is required to fill the bronze requirement for Software track.** We will integrate **Easy BBK**, a project from last year, which eases query of the parts database, to achieve this, and also to build upon/use a previous project. **We need someone to figure out how to install and use Easy BBK ASAP**
* segregation of groups of metabolites + reactions
    * can view and entire species as one metabolite, and zoom into it to see internal reactions
    * need to have this sort of structure on multiple levels, using **compartments** and **subsystems**. This is to balance the eternal fight between 'showing too much data' and 'showing data in a meaningful way'
* currently, there is no optimize button. Add a backend route to take the new modify model (POST request with Content-Type:application/json) and optimize using COBRApy.
* improve UI. right now its pretty bad. Can someone can make some mockups for this using [https://balsamiq.com/products/mockups/](https://balsamiq.com/products/mockups/) or Photoshop. Getting screenshots of nice lookings sites helps a lot too.
* improve usability. tutorials, legend, tooltips. etc.
* write backend routes to employ our acFBA pipeline

# NO DATABASE! ;)
