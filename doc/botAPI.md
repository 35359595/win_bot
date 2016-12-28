# Bot API docs

Each game tick your bot receive post message with game info.
After it you should send post message to game engine with you decision.

## Income Post Message structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>settings</code></td>
      <td><code>object</code></td>
      <td>Game settings for current tick</td>
    </tr>
    <tr>
      <td><code>playerIndex</code></td>
      <td><code>integer</code></td>
      <td>Index of player, you can move now. Can be <code>0 - 2</code></td>
    </tr>
    <tr>
      <td><code>tick</code></td>
      <td><code>integer</code></td>
      <td>Current tick number</td>
    </tr>
    <tr>
      <td><code>tick</code></td>
      <td><code>integer</code></td>
      <td>Current tick number</td>
    </tr>
    <tr>
      <td><code>yourTeam</code></td>
      <td><code>object</code></td>
      <td>Your team info</td>
    </tr>
    <tr>
      <td><code>opponentTeam</code></td>
      <td><code>object</code></td>
      <td>Opponent team info</td>
    </tr>
    <tr>
      <td><code>ball</code></td>
      <td><code>object</code></td>
      <td>Ball info</td>
    </tr>
  </tbody>
</table>

## Outcome Post Message structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>velocity</code></td>
      <td><code>number</code></td>
      <td>New velocity for current player</td>
    </tr>
    <tr>
      <td><code>direction</code></td>
      <td><code>number</code></td>
      <td>New direction for current player</td>
    </tr>
  </tbody>
</table>


## Team info structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>type</code></td>
      <td><code>string</code></td>
      <td>Can be <code>home</code> or <code>guest</code>.</td>
    </tr>
    <tr>
      <td><code>players</code></td>
      <td><code>array</code></td>
      <td>Array with team players info</td>
    </tr>
  </tbody>
</table>

## Ball and Player info structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>x</code></td>
      <td><code>integer</code></td>
      <td>X coordinate of unit</td>
    </tr>
    <tr>
      <td><code>y</code></td>
      <td><code>integer</code></td>
      <td>Y coordinate of unit</td>
    </tr>
    <tr>
      <td><code>direction</code></td>
      <td><code>number</code></td>
      <td>Unit direction in radians</td>
    </tr>
    <tr>
      <td><code>velocity</code></td>
      <td><code>number</code></td>
      <td>Unit velocity</td>
    </tr>
  </tbody>
</table>





# Settings structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>field</code></td>
      <td><code>object</code></td>
      <td>Containe 2 properties: <code>width</code> and <code>height</code> of game field</td>
    </tr>
    <tr>
      <td><code>player</code></td>
      <td><code>object</code></td>
      <td>Basic info same and constant for all players</td>
    </tr>
    <tr>
      <td><code>ball</code></td>
      <td><code>object</code></td>
      <td>Basic info about ball</td>
    </tr>
    <tr>
      <td><code>playersInTeam</code></td>
      <td><code>integer</code></td>
      <td>Amount players in each team</td>
    </tr>
    <tr>
      <td><code>periodDuration</code></td>
      <td><code>integer</code></td>
      <td>Duration of each period in ms</td>
    </tr>
    <tr>
      <td><code>tickDuration</code></td>
      <td><code>integer</code></td>
      <td>Duration of each tick in ms</td>
    </tr>
  </tbody>
</table>

## Player basic settings structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>maxVelocity</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>maxVelocityIncrement</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>radius</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>mass</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
  </tbody>
</table>

## Ball basic settings structure

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th width="50">Type</th>
      <th width=100%>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>maxVelocity</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>moveDeceleration</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>radius</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>mass</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
    <tr>
      <td><code>kickAcceleration</code></td>
      <td><code>integer</code></td>
      <td></td>
    </tr>
  </tbody>
</table>

