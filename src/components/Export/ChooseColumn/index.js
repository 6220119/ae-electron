// @flow
import React from 'react'
import Card, { CardActions } from 'material-ui/Card'
import Collapse from 'material-ui/transitions/Collapse'
import IconButton from 'material-ui/IconButton'
import Icon from 'material-ui/Icon'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Snackbar from 'material-ui/Snackbar'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import get from 'lodash/get'

import Taxonomies from './Taxonomies'
import Properties from './Properties'
import Filter from './Filter'
import exportTaxonomiesData from '../exportTaxonomiesData'
import exportPcoPropertiesData from '../exportPcoPropertiesData'
import exportRcoPropertiesData from '../exportRcoPropertiesData'
import exportTaxPropertiesData from '../exportTaxPropertiesData'
import exportTaxFiltersData from '../exportTaxFiltersData'
import exportPcoFiltersData from '../exportPcoFiltersData'
import exportRcoFiltersData from '../exportRcoFiltersData'
import ErrorBoundary from '../../shared/ErrorBoundary'

const StyledSnackbar = styled(Snackbar)`
  div {
    min-width: auto;
    background-color: #2e7d32 !important;
  }
`
const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: rgb(255, 243, 224) !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
  background-color: #ffcc80;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
`

const Container = styled.div`
  padding: 0 5px;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  height: 100%;
`
// need to call all local data in case it has not yet been initiated
// (this is an apollo-link-state error)
const enhance = compose(
  exportTaxonomiesData,
  exportTaxPropertiesData,
  exportPcoPropertiesData,
  exportRcoPropertiesData,
  exportTaxFiltersData,
  exportPcoFiltersData,
  exportRcoFiltersData,
  withState('taxonomiesExpanded', 'setTaxonomiesExpanded', true),
  withState('filterExpanded', 'setFilterExpanded', false),
  withState('propertiesExpanded', 'setPropertiesExpanded', false),
  withState('message', 'setMessage', ''),
  withHandlers({
    onSetMessage: ({ message, setMessage }) => (message: String) => {
      setMessage(message)
      if (!!message) {
        setTimeout(() => setMessage(''), 5000)
      }
    },
  }),
  withHandlers({
    onToggleTaxonomies: ({
      taxonomiesExpanded,
      setTaxonomiesExpanded,
      setFilterExpanded,
      setPropertiesExpanded,
    }) => () => {
      setTaxonomiesExpanded(!taxonomiesExpanded)
      // close all others
      setFilterExpanded(false)
      setPropertiesExpanded(false)
    },
    onToggleFilter: ({
      exportTaxonomiesData,
      filterExpanded,
      setTaxonomiesExpanded,
      setFilterExpanded,
      setPropertiesExpanded,
      onSetMessage,
    }) => () => {
      const exportTaxonomies = get(exportTaxonomiesData, 'exportTaxonomies', [])
      if (!filterExpanded && exportTaxonomies.length > 0) {
        setFilterExpanded(true)
        // close all others
        setTaxonomiesExpanded(false)
        setPropertiesExpanded(false)
      } else {
        setFilterExpanded(false)
        onSetMessage('Bitte wählen Sie mindestens eine Taxonomie')
      }
    },
    onToggleProperties: ({
      exportTaxonomiesData,
      propertiesExpanded,
      setTaxonomiesExpanded,
      setFilterExpanded,
      setPropertiesExpanded,
      onSetMessage,
    }) => () => {
      const exportTaxonomies = get(exportTaxonomiesData, 'exportTaxonomies', [])
      if (!propertiesExpanded && exportTaxonomies.length > 0) {
        setPropertiesExpanded(true)
        // close all others
        setTaxonomiesExpanded(false)
        setFilterExpanded(false)
      } else {
        setPropertiesExpanded(false)
        onSetMessage('Bitte wählen Sie mindestens eine Gruppe')
      }
    },
  })
)

const Export = ({
  taxonomiesExpanded,
  filterExpanded,
  propertiesExpanded,
  onToggleTaxonomies,
  onToggleFilter,
  onToggleProperties,
  message,
}: {
  taxonomiesExpanded: Boolean,
  filterExpanded: Boolean,
  propertiesExpanded: Boolean,
  onToggleTaxonomies: () => {},
  onToggleFilter: () => {},
  onToggleProperties: () => {},
  message: String,
}) => (
  <ErrorBoundary>
    <Container>
      <StyledCard>
        <StyledCardActions disableActionSpacing onClick={onToggleTaxonomies}>
          <CardActionTitle>1. Taxonomie(n) wählen</CardActionTitle>
          <CardActionIconButton
            data-expanded={taxonomiesExpanded}
            aria-expanded={taxonomiesExpanded}
            aria-label="Show more"
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <Collapse in={taxonomiesExpanded} timeout="auto" unmountOnExit>
          <Taxonomies />
        </Collapse>
      </StyledCard>
      <StyledCard>
        <StyledCardActions disableActionSpacing onClick={onToggleFilter}>
          <CardActionTitle>2. filtern</CardActionTitle>
          <CardActionIconButton
            data-expanded={filterExpanded}
            aria-expanded={filterExpanded}
            aria-label="Show more"
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <Collapse in={filterExpanded} timeout="auto" unmountOnExit>
          <Filter />
        </Collapse>
      </StyledCard>
      <StyledCard>
        <StyledCardActions disableActionSpacing onClick={onToggleProperties}>
          <CardActionTitle>3. Eigenschaften wählen</CardActionTitle>
          <CardActionIconButton
            data-expanded={propertiesExpanded}
            aria-expanded={propertiesExpanded}
            aria-label="Show more"
          >
            <Icon>
              <ExpandMoreIcon />
            </Icon>
          </CardActionIconButton>
        </StyledCardActions>
        <Collapse in={propertiesExpanded} timeout="auto" unmountOnExit>
          <Properties />
        </Collapse>
      </StyledCard>
      <StyledSnackbar open={!!message} message={message} />
    </Container>
  </ErrorBoundary>
)

export default enhance(Export)
