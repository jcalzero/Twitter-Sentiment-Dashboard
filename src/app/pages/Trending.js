import React, { Component } from 'react'

export class Trending extends Component {
  render() {
    return (
      <div>
        <div className="page-header">
        <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-format-list-bulleted"></i>
            </span> Trending Twitter Topics </h3>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <p className="card-description"> Location: United States</p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Topic/Keywords</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jacob</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Messsy</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Peter</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Dave</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Jacob</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Messsy</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Peter</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                      <tr>
                        <td>Dave</td>
                        <td><label className="badge badge-success">Trending</label></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Trending;
